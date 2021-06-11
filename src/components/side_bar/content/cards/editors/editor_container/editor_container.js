import React, {useState} from 'react';
import PropTypes from 'prop-types';
import LotEditorModal from "../card_editor/lot_editor_modal";
import {showEditor} from "../../../../../../redux/actions/card_actions";
import {useDispatch, useSelector} from "react-redux";
import SkuEditorModal from "../sku_editor/sku_editor_modal";

const EditorContainer = props => {

	const {
		cardId,
		processId,
		binId,
		setSelectedCard
	} = props

	const dispatch = useDispatch()
	const onShowCardEditor = (bool) => dispatch(showEditor(bool))

	const showCardEditor = useSelector(state => { return state.cardsReducer.showEditor })
	const selectedLotTemplatesId = useSelector(state => {return state.lotTemplatesReducer.selectedLotTemplatesId})

	const [showSkuEditor, setShowSkuEditor] = useState(false)

	return(
		<>
			{showCardEditor &&
			<LotEditorModal
				isOpen={!showSkuEditor}
				// isOpen={true}
				onAfterOpen={null}
				cardId={cardId}
				processId={processId}
				binId={binId}
				close={()=>{
					onShowCardEditor(false)
					setSelectedCard(null)
				}}
				showSkuEditor={showCardEditor}
				setShowSkuEditor={setShowSkuEditor}
			/>
			}

			{showSkuEditor &&
			<SkuEditorModal
				isOpen={showSkuEditor}
				selectedLotTemplatesId={selectedLotTemplatesId}
				lotTemplateId={selectedLotTemplatesId}
				close={() => setShowSkuEditor(false)}
			/>
			}
		</>
	)

};

EditorContainer.propTypes = {

};

export default EditorContainer;
