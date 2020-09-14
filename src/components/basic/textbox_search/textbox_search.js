import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components'
import ClickOutside from './components/ClickOutside';

import { globStyle } from '../../../global_style'
import { LightenDarkenColor } from '../../../methods/utils/color_utils'


import Label from './components/Label';
import Content from './components/Content';
import Textbox from './components/Dropdown';
import Loading from './components/Loading';
import Clear from './components/Clear';
import Separator from './components/Separator';
import TextboxHandle from './components/DropdownHandle';

import { debounce, hexToRGBA, isEqual, getByPath, getProp, valueExistInSelected } from './util';
import { LIB_NAME } from './constants';

import theme from '../../../theme.js'

export class TextBoxSearch extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onTextboxClose: PropTypes.func,
    onTextboxOpen: PropTypes.func,
    onClearAll: PropTypes.func,
    onSelectAll: PropTypes.func,
    values: PropTypes.array,
    options: PropTypes.array.isRequired,
    keepOpen: PropTypes.bool,
    showSelectedBox: PropTypes.bool,
    textboxGap: PropTypes.number,
    multi: PropTypes.bool,
    placeholder: PropTypes.string,
    addPlaceholder: PropTypes.string,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    loading: PropTypes.bool,
    clearable: PropTypes.bool,
    searchable: PropTypes.bool,
    separator: PropTypes.bool,
    textboxHandle: PropTypes.bool,
    searchBy: PropTypes.string,
    sortBy: PropTypes.string,
    closeOnScroll: PropTypes.bool,
    openOnTop: PropTypes.bool,
    style: PropTypes.object,
    contentRenderer: PropTypes.func,
    textboxRenderer: PropTypes.func,
    itemRenderer: PropTypes.func,
    noDataRenderer: PropTypes.func,
    optionRenderer: PropTypes.func,
    inputRenderer: PropTypes.func,
    loadingRenderer: PropTypes.func,
    clearRenderer: PropTypes.func,
    separatorRenderer: PropTypes.func,
    textboxHandleRenderer: PropTypes.func,
    direction: PropTypes.string,
    required: PropTypes.bool,
    pattern: PropTypes.string,
    // The pattern attribute specifies a regular expression that the <input> element's value is checked against on form submission
    // set to null to bypass
    name: PropTypes.string,
    className: PropTypes.string,
    schema: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.state = {
      textbox: false,
      values: props.values,
      search: '',
      selectBounds: {},
      cursor: null,

      currentValue: ''
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
      safeString: this.safeString,

      setValue: this.setValue,
      setValues: this.setValues,
    };

    this.select = React.createRef();
    this.textboxRoot = typeof document !== 'undefined' && document.createElement('div');
  }

  componentDidMount() {

    this.props.portal && this.props.portal.appendChild(this.textboxRoot);
    window.addEventListener('resize', debounce(this.updateSelectBounds));
    window.addEventListener('scroll', debounce(this.onScroll));

    this.dropDown('close');

    if (this.select) {
      this.updateSelectBounds();
    }

    if (!!this.props.defaultValue) {
      this.addItem(this.props.defaultValue)
      this.setValue(this.props.defaultValue.name)
      this.setState({currentValue : this.props.defaultValue.name})
      this.setSearch({target: {value: this.props.defaultValue.name}})
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

    if (prevState.textbox && prevState.textbox !== this.state.textbox) {
      this.onTextboxClose();
    }

    if (!prevState.textbox && prevState.textbox !== this.state.textbox) {
      this.props.onTextboxOpen();
    }

    if (prevState.values !== this.state.values && !this.props.fillable && this.state.values.length) {
      this.clearAll();
    }
  }

  componentWillUnmount() {
    this.props.portal && this.props.portal.removeChild(this.textboxRoot);
    window.removeEventListener(
      'resize',
      debounce(this.updateSelectBounds, this.props.debounceDelay)
    );
    window.removeEventListener('scroll', debounce(this.onScroll, this.props.debounceDelay));
  }

  onTextboxClose = () => {
    this.setState({ cursor: null });
    this.props.onTextboxClose();
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
      target.offsetParent.classList.contains('react-textbox-select-dropdown')
    ) {
      return;
    }

    if (this.props.keepOpen) {
      return this.setState({ textbox: true });
    }

    if (action === 'close' && this.state.textbox) {
      this.select.current.blur();

      return this.setState({
        textbox: false,
        search: this.props.clearOnBlur ? '' : this.state.search
      });
    }

    if (action === 'open' && !this.state.textbox) {
      return this.setState({ textbox: true });
    }

    if (action === 'toggle') {
      this.select.current.focus();
      return this.setState({ textbox: !this.state.textbox });
    }

    return false;
  };

  getSelectRef = () => this.select.current;

  setValue = (value) => {
    this.setState({currentValue : value})
  }

  setValues = (values) => {
    this.setState({values: [values]})
  }

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
        textbox: false
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

    this.setState({
      values: this.state.values.filter(
        (values) =>
          getByPath(values, this.props.valueField) !== getByPath(item, this.props.valueField)
      )
    });
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
    this.state.currentValue == option[this.props.labelField]

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
      this.dropDown('close');
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

  renderTextbox = (ItemComponent) =>
    this.props.portal ? (
      ReactDOM.createPortal(
        <Textbox ItemComponent={ItemComponent} TextBoxComponent={this.props.TextBoxComponent} props={this.props} state={this.state} methods={this.methods} />,
        this.textboxRoot
      )
    ) : (
        <Textbox ItemComponent={ItemComponent} TextComponent={this.props.TextComponent} TextBoxComponent={this.props.TextBoxComponent} props={this.props} state={this.state} methods={this.methods} />
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

    const { ItemComponent, ReactTextboxSelect, Container } = this.props;

    return (
      <Container className={this.props.className}>
        <ClickOutside ClickOutsideComponent={this.props.ClickOutsideComponent} onClickOutside={(event) => this.dropDown('close', event)}>
          <ReactTextboxSelect
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
            schema={this.props.schema}>

            <Content InputComponent={this.props.InputComponent} ContentComponent={this.props.ContentComponent} props={this.props} state={this.state} methods={this.methods} />

            {this.props.loading && <Loading props={this.props} />}

            {this.state.textbox && !this.props.disabled && this.renderTextbox(ItemComponent)}
          </ReactTextboxSelect>
        </ClickOutside>
      </Container>
    );
  }
}

export const DefaultReactTextboxSelect = styled.div`

    background-color: ${props => props.theme.bg.quinary};
    color: ${props => props.theme.bg.octonary};

    font-family: ${props => props.theme.font.primary};
    font-size: ${props => props.theme.fontSize.sz3};

    position: relative;
    display: flex;

    vertical-align: middle;
    line-height: 1.6rem;
    height: 1.6rem;
    width: 100%;
    padding: 2px 5px;
    direction: ${({ direction }) => direction};
    cursor: pointer;
    min-height: 36px;
    ${({ disabled }) =>
    disabled ? 'cursor: not-allowed;pointer-events: none;opacity: 0.3;' : 'pointer-events: all;'}

    border-bottom: 2px solid transparent;
    border-radius: 0.2rem;

    :focus,
    :focus-within {
        color: ${props => props.theme.bg.octonary};
        background-color: ${props => LightenDarkenColor(props.theme.bg.quinary, 10)};
        box-shadow: none;
        border-bottom: 2px solid ${props => !!props.schema ? props.theme.schema[props.schema].solid : props.theme.bg.octonary};
    }
`;

const DefaultContainer = styled.div`

`;

TextBoxSearch.defaultProps = {
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
  textboxHandle: true,
  separator: false,
  keepOpen: undefined,
  noDataLabel: 'No data',
  createNewLabel: 'add {search}',
  disabledLabel: 'disabled',
  textboxGap: 5,
  closeOnScroll: false,
  debounceDelay: 0,
  labelField: 'label',
  valueField: 'value',
  color: '#0074D9',
  keepSelectedInList: true,
  closeOnSelect: false,
  clearOnBlur: true,
  clearOnSelect: true,
  textboxPosition: 'bottom',
  textboxHeight: '300px',
  autoFocus: false,
  portal: null,
  create: false,
  direction: 'ltr',
  name: null,
  required: false,
  pattern: '',
  onChange: () => undefined,
  onTextboxOpen: () => undefined,
  onTextboxClose: () => undefined,
  onClearAll: () => undefined,
  onSelectAll: () => undefined,
  onCreateNew: () => undefined,
  searchFn: () => undefined,
  handleKeyDownFn: () => undefined,
  additionalProps: null,
  showButton: true,
  ReactTextboxSelect: DefaultReactTextboxSelect,
  Container: DefaultContainer,
  fillable: true,
  schema: null,
};



export default TextBoxSearch;
