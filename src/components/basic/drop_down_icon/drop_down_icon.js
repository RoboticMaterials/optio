import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import ClickOutside from './components/ClickOutside';

import { globStyle } from '../../../global_style'
import { LightenDarkenColor } from '../../../methods/utils/color_utils'


import Label from './components/Label';
import Content from './components/Content';
import Dropdown from './components/Dropdown';
import Loading from './components/Loading';
import Clear from './components/Clear';
import Separator from './components/Separator';

import { debounce, hexToRGBA, isEqual, getByPath, getProp, valueExistInSelected } from './util';
import { LIB_NAME } from './constants';

import theme from '../../../theme.js'
import Portal from '../../../higher_order_components/portal';

export class DropDownIcon extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onDropdownClose: PropTypes.func,
    onDropdownOpen: PropTypes.func,
    onClearAll: PropTypes.func,
    onSelectAll: PropTypes.func,
    values: PropTypes.array,
    options: PropTypes.array.isRequired,
    keepOpen: PropTypes.bool,
    showSelectedBox: PropTypes.bool,
    fixedHeight: PropTypes.bool,
    dropdownGap: PropTypes.number,
    multi: PropTypes.bool,
    placeholder: PropTypes.string,
    addPlaceholder: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    loading: PropTypes.bool,
    clearable: PropTypes.bool,
    searchable: PropTypes.bool,
    separator: PropTypes.bool,
    dropdownHandle: PropTypes.bool,
    searchBy: PropTypes.string,
    sortBy: PropTypes.string,
    closeOnScroll: PropTypes.bool,
    openOnTop: PropTypes.bool,
    style: PropTypes.object,
    contentRenderer: PropTypes.func,
    dropdownRenderer: PropTypes.func,
    itemRenderer: PropTypes.func,
    noDataRenderer: PropTypes.func,
    optionRenderer: PropTypes.func,
    inputRenderer: PropTypes.func,
    loadingRenderer: PropTypes.func,
    clearRenderer: PropTypes.func,
    separatorRenderer: PropTypes.func,
    dropdownHandleRenderer: PropTypes.func,
    direction: PropTypes.string,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    // The pattern attribute specifies a regular expression that the <input> element's value is checked against on form submission
    // set to null to bypass
    name: PropTypes.string,
    className: PropTypes.string,
    schema: PropTypes.string,
    height: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      values: props.values,
      search: '',
      selectBounds: {},
      cursor: null,
      dropdownSize: {
        offsetWidth: 0,
        offsetHeight: 0,
        offsetLeft: 0,
        offsetTop: 0,
      }
    };

    this.methods = {
      removeItem: this.removeItem,
      dropDown: this.dropDown,
      addItem: this.addItem,
      setSearch: this.setSearch,
      getInputSize: this.getInputSize,
      toggleSelectAll: this.toggleSelectAll,
      clearAll: this.clearAll,
      selectAll: this.selectAll,
      searchResults: this.searchResults,
      getSelectRef: this.getSelectRef,
      isSelected: this.isSelected,
      getSelectBounds: this.getSelectBounds,
      areAllSelected: this.areAllSelected,
      handleKeyDown: this.handleKeyDown,
      activeCursorItem: this.activeCursorItem,
      createNew: this.createNew,
      sortBy: this.sortBy,
      safeString: this.safeString
    };

    this.select = React.createRef();
    this.dropdownRef = React.createRef()
    this.dropdownRoot = typeof document !== 'undefined' && document.createElement('div');
  }

  componentDidMount() {
    this.props.portal && this.props.portal.appendChild(this.dropdownRoot);
    window.addEventListener('resize', debounce(this.updateSelectBounds), {passive:true});
    window.addEventListener('scroll', debounce(this.onScroll), {passive:true});

    this.dropDown('close');

    if (this.select) {
      this.updateSelectBounds();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !isEqual(prevProps.values, this.props.values) &&
      isEqual(prevProps.values, prevState.values)
    ) {
      this.setState({ values: this.props.values }, () => {
        this.props.onChange(this.props.values);
      });
    }

    if (prevState.values !== this.state.values) {
      if (this.state.values.length) { this.props.onChange(this.state.values) };
      this.updateSelectBounds();
    }

    if (prevState.search !== this.state.search) {
      this.updateSelectBounds();
    }

    if (prevState.values !== this.state.values && this.props.closeOnSelect) {
      this.dropDown('close');
    }

    if (prevProps.multi !== this.props.multi) {
      this.updateSelectBounds();
    }

    if (prevState.dropdown && prevState.dropdown !== this.state.dropdown) {
      this.onDropdownClose();
    }

    if (!prevState.dropdown && prevState.dropdown !== this.state.dropdown) {
      this.props.onDropdownOpen();
    }

    if (prevState.values !== this.state.values && !this.props.fillable && this.state.values.length) {
      this.clearAll();
    }

    // if dropdown ref has current value
    if(this.dropdownRef.current && !this.props.fixedHeight) {
      // get height
      let offsetHeight = this.dropdownRef.current.offsetHeight;

      // check if state offsetHeight does not match current offsetHeight
      if(offsetHeight !== this.state.dropdownSize.offsetHeight) {
        let offsetWidth  = this.dropdownRef.current.offsetWidth;
        let offsetTop  = this.dropdownRef.current.offsetTop;
        let offsetLeft  = this.dropdownRef.current.offsetLeft;

        // update state
        this.setState({
          dropdownSize: {
            offsetWidth,
            offsetHeight,
            offsetLeft,
            offsetTop,
          },
        });
      }
    }
    // if dropdownRef doesn't have current value, and offsetHeight isn't already 0, set it to zero
    else if(this.state.dropdownSize.offsetHeight !== 0 ) {
      // update state
      this.setState({
        dropdownSize: {
          offsetWidth: 0,
          offsetHeight: 0,
          offsetLeft: 0,
          offsetTop: 0,
        },
      });
    }
  }



  componentWillUnmount() {
    this.props.portal && this.props.portal.removeChild(this.dropdownRoot);
    window.removeEventListener(
      'resize',
      debounce(this.updateSelectBounds, this.props.debounceDelay), {passive:true}
    );
    window.removeEventListener('scroll', debounce(this.onScroll, this.props.debounceDelay), {passive:true});
  }

  onDropdownClose = () => {
    this.setState({ cursor: null });
    this.props.onDropdownClose();
  };

  onScroll = () => {
    if (this.props.closeOnScroll) {
      this.dropDown('close');
    }

    this.updateSelectBounds();
  };

  updateSelectBounds = () =>
    this.select.current &&
    this.setState({
      selectBounds: this.select.current.getBoundingClientRect()
    });

  getSelectBounds = () => this.state.selectBounds;

  dropDown = (action = 'toggle', event) => {
    const target = (event && event.target) || (event && event.srcElement);

    if (
      this.props.portal &&
      !this.props.closeOnScroll &&
      !this.props.closeOnSelect &&
      event &&
      target &&
      target.offsetParent &&
      target.offsetParent.classList.contains('react-dropdown-select-dropdown')
    ) {
      return;
    }

    if (this.props.keepOpen) {
      return this.setState({ dropdown: true });
    }

    if (action === 'close' && this.state.dropdown) {
      this.select.current.blur();

      return this.setState({
        dropdown: false,
        search: this.props.clearOnBlur ? '' : this.state.search
      });
    }

    if (action === 'open' && !this.state.dropdown) {
      return this.setState({ dropdown: true });
    }

    if (action === 'toggle') {
      this.select.current.focus();
      return this.setState({ dropdown: !this.state.dropdown });
    }

    return false;
  };

  getSelectRef = () => this.select.current;

  addItem = (item) => {
    if (this.props.multi) {
      if (
        valueExistInSelected(getByPath(item, this.props.valueField), this.state.values, this.props)
      ) {
        return this.removeItem(null, item, false);
      }

      this.setState({
        values: [...this.state.values, item]
      });
    } else {
      this.setState({
        values: [item],
        dropdown: false
      });
    }

    this.props.clearOnSelect && this.setState({ search: '' });

    return true;
  };

  removeItem = (event, item, close = false) => {
    if (event && close) {
      event.preventDefault();
      event.stopPropagation();
      this.dropDown('close');
    }

    let newValues = this.state.values.filter(
        (values) =>
            getByPath(values, this.props.valueField) !== getByPath(item, this.props.valueField)
    )

    this.setState({
      values: newValues
    });

    this.props.onRemoveItem && this.props.onRemoveItem(newValues)
  };

  setSearch = (event) => {
    this.setState({
      cursor: null
    });

    this.setState({
      search: event.target.value
    });
  };

  getInputSize = () => {
    if (this.state.values && this.state.values.length) {
      return 0;
    } else {
      return this.props.placeholder.length;
    }
  };

  toggleSelectAll = () => {
    return this.setState({
      values: this.state.values.length === 0 ? this.selectAll() : this.clearAll()
    });
  };

  clearAll = () => {
    this.props.onClearAll();
    this.setState({
      values: []
    });
  };

  selectAll = (valuesList = []) => {
    this.props.onSelectAll();
    const values = valuesList.length > 0
      ? valuesList
      : this.props.options.filter((option) => !option.disabled);

    this.setState({ values });
  };

  isSelected = (option) =>
    !!this.state.values.find(
      (value) =>
        getByPath(value, this.props.valueField) === getByPath(option, this.props.valueField)
    );

  areAllSelected = () =>
    this.state.values.length === this.props.options.filter((option) => !option.disabled).length;

  safeString = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  sortBy = () => {
    const { sortBy, options } = this.props;

    if (!sortBy) {
      return options;
    }

    options.sort((a, b) => {
      if (getProp(a, sortBy) < getProp(b, sortBy)) {
        return -1;
      } else if (getProp(a, sortBy) > getProp(b, sortBy)) {
        return 1;
      } else {
        return 0;
      }
    });
    return options;
  };

  searchFn = ({ state, methods }) => {
    const regexp = new RegExp(methods.safeString(state.search), 'i');

    return methods
      .sortBy()
      .filter((item) =>
        regexp.test(getByPath(item, this.props.searchBy) || getByPath(item, this.props.valueField))
      );
  };

  searchResults = () => {
    const args = { state: this.state, props: this.props, methods: this.methods };

    return this.props.searchFn(args) || this.searchFn(args);
  };

  activeCursorItem = (activeCursorItem) =>
    this.setState({
      activeCursorItem
    });

  handleKeyDown = (event) => {
    const args = {
      event,
      state: this.state,
      props: this.props,
      methods: this.methods,
      setState: this.setState.bind(this)
    };

    return this.props.handleKeyDownFn(args) || this.handleKeyDownFn(args);
  };

  handleKeyDownFn = ({ event, state, props, methods, setState }) => {
    const { cursor } = state;
    const escape = event.key === 'Escape';
    const enter = event.key === 'Enter';
    const arrowUp = event.key === 'ArrowUp';
    const arrowDown = event.key === 'ArrowDown';
    const tab = event.key === 'Tab' && !event.shiftKey;
    const shiftTab = event.shiftKey && event.key === 'Tab';

    if ((arrowDown || tab) && cursor === null) {
      return setState({
        cursor: 0
      });
    }

    if (arrowUp || arrowDown || shiftTab || tab) {
      event.preventDefault();
    }

    if (escape) {
      this.dropDown('close');
    }

    if (enter) {
      const currentItem = methods.searchResults()[cursor];
      if (currentItem && !currentItem.disabled) {
        if (props.create && valueExistInSelected(state.search, state.values, props)) {
          return null;
        }

        methods.addItem(currentItem);
      }
    }

    if ((arrowDown || tab) && methods.searchResults().length === cursor) {
      return setState({
        cursor: 0
      });
    }

    if (arrowDown || tab) {
      setState((prevState) => ({
        cursor: prevState.cursor + 1
      }));
    }

    if ((arrowUp || shiftTab) && cursor > 0) {
      setState((prevState) => ({
        cursor: prevState.cursor - 1
      }));
    }

    if ((arrowUp || shiftTab) && cursor === 0) {
      setState({
        cursor: methods.searchResults().length
      });
    }
  };

  renderDropdown = (ItemComponent) =>
    this.props.portal ? (
      ReactDOM.createPortal(

        <Dropdown dropdownRef={this.dropdownRef} ItemComponent={ItemComponent} DropDownComponent={this.props.DropDownComponent}
          props={this.props} state={this.state} methods={this.methods} onMouseEnter = {(item) => this.props.onMouseEnter(item)} onMouseLeave = {(item) => this.props.onMouseLeave(item)}
          icons = {this.props.icons} setfieldType = {this.props.setFieldType}
         />,
        this.dropdownRoot
      )
    ) : (
        <Dropdown dropdownRef={this.dropdownRef} ItemComponent={ItemComponent} TextComponent={this.props.TextComponent} DropDownComponent={this.props.DropDownComponent}
         props={this.props} state={this.state} methods={this.methods} onMouseEnter = {(item) => this.props.onMouseEnter}
         icons = {this.props.icons} setfieldType = {this.props.setFieldType}
         onMouseLeave = {(item) => this.props.onMouseLeave} />
      );

  createNew = (item) => {
    const newValue = {
      [this.props.labelField]: item,
      [this.props.valueField]: item
    };

    this.addItem(newValue);
    this.props.onCreateNew(newValue);
    this.setState({ search: '' });
  };

  render() {

    const { ItemComponent, ReactDropdownSelect, Container } = this.props;

    return (
      <Container css={this.props.containerCss} className={this.props.className} style={!this.props.fixedHeight ? {...this.props.containerStyle, paddingBottom: this.state.dropdownSize.offsetHeight} : this.props.containerStyle}>
        <ClickOutside ClickOutsideComponent={this.props.ClickOutsideComponent} onClickOutside={(event) => this.dropDown('close', event)}>
          <ReactDropdownSelect
            css={this.props.reactDropdownSelectCss}
            onKeyDown={this.handleKeyDown}
            onClick={(event) => this.dropDown('open', event)}
            // onFocus={(event) => this.dropDown('open', event)}
            tabIndex={this.props.disabled ? '-1' : '0'}
            direction={this.props.direction}
            style={this.props.style}
            ref={this.select}
            disabled={this.props.disabled}
            className={`${LIB_NAME} ${this.props.className}`}
            color={this.props.color}
            {...this.props.additionalProps}
            height = {this.props.height}
            schema={this.props.schema}>

            <Content InputComponent={this.props.InputComponent} ContentComponent={this.props.ContentComponent} props={this.props} state={this.state} methods={this.methods} />

            {(this.props.name || this.props.required) && (
              <input
                tabIndex={-1}
                onChange={this.methods.setSearch}
                style={{ opacity: 0, width: 0, position: 'absolute' }}
                name={this.props.name}
                required={this.props.required}
                pattern={this.props.pattern}
                value={this.state.values.map(value => value[this.props.labelField]).toString() || []}
                disabled={this.props.disabled}
              />
            )}

            {this.props.loading && <Loading props={this.props} />}

            {this.props.clearable && (
              <Clear props={this.props} state={this.state} methods={this.methods} />
            )}

            {this.props.separator && (
              <Separator props={this.props} state={this.state} methods={this.methods} />
            )}

            <div style = {{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center'}}>
              <i class = 'fas fa-chevron-down' style = {{color: '#7e7e7e', marginRight: '1rem', fontSize: '1rem'}}/>
            </div>

              {this.state.dropdown && !this.props.disabled && this.renderDropdown(ItemComponent)}
          </ReactDropdownSelect>
        </ClickOutside>
      </Container>
    );
  }
}

export const DefaultReactDropdownSelect = styled.div`

    background-color: ${props => props.theme.bg.primary};
    box-shadow: .5px .5px 1px 1px rgba(0,0,0,0.2);
    color: ${props => props.theme.bg.primary};

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};

    position: relative;
    display: flex;

    vertical-align: middle;
    line-height: 1.6rem;
    height: ${props => props.height};
    width: 100%;
    padding: 2px 5px;
    direction: ${({ direction }) => direction};
    cursor: pointer;
    min-height: 36px;
    ${({ disabled }) =>
    disabled ? 'cursor: not-allowed;pointer-events: none;opacity: 0.3;' : 'pointer-events: all;'}

    border-bottom: 2px solid transparent;
    border-radius: 0.4rem;

    :focus, :focus-within {
        color: ${props => props.theme.bg.octonary};
        background-color: ${props => props.theme.bg.primary};
        box-shadow: none;
        border-bottom: 2px solid ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.bg.octonary};
    }

  ${props => props.css && props.css};


`;

const DefaultContainer = styled.div`
  ${props => props.css && props.css};
`;

DropDownIcon.defaultProps = {
  addPlaceholder: '',
  placeholder: 'Select...',
  values: [],
  options: [],
  multi: false,
  showSelectedBox: false,
  disabled: false,
  searchBy: 'label',
  sortBy: null,
  clearable: false,
  searchable: true,
  fixedHeight: true,
  dropdownHandle: true,
  separator: false,
  keepOpen: undefined,
  noDataLabel: 'No data',
  createNewLabel: 'add {search}',
  disabledLabel: 'disabled',
  dropdownGap: 2,
  closeOnScroll: false,
  debounceDelay: 0,
  labelField: 'label',
  valueField: 'value',
  color: '#0074D9',
  keepSelectedInList: true,
  closeOnSelect: false,
  clearOnBlur: true,
  clearOnSelect: true,
  dropdownPosition: 'bottom',
  dropdownHeight: '600px',
  autoFocus: false,
  portal: null,
  create: false,
  direction: 'ltr',
  name: null,
  required: false,
  pattern: '',
  onChange: () => undefined,
  onDropdownOpen: () => undefined,
  onDropdownClose: () => undefined,
  onClearAll: () => undefined,
  onSelectAll: () => undefined,
  onCreateNew: () => undefined,
  searchFn: () => undefined,
  handleKeyDownFn: () => undefined,
  additionalProps: null,
  showButton: true,
  ReactDropdownSelect: DefaultReactDropdownSelect,
  Container: DefaultContainer,
  fillable: true,
  schema: null,
  height: null,
  onMouseEnter: () => {},
  onMouseLeave: () => {},
};



export default DropDownIcon;
