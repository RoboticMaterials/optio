import React, {useCallback, useEffect, useState} from "react";

// external components
import Modal from 'react-modal';
import {useDispatch, useSelector} from "react-redux";

// internal components
import Button from "../../../../../basic/button/button";
import DashboardButton from "../../dashboard_buttons/dashboard_button/dashboard_button";

// actions
import {getCards, getProcessCards, putCard} from "../../../../../../redux/actions/card_actions";

// styles
import * as styled from './merge_modal.style'
import {FINISH_BIN_ID, LOT_FILTER_OPTIONS, SORT_DIRECTIONS} from "../../../../../../constants/lot_contants";
import LotEditorContainer from "../../../../../side_bar/content/cards/editors/card_editor/lot_editor_container";
import LotContainer from "../../../../../side_bar/content/cards/lot/lot_container";
import BoxWrapper from "../../../../../basic/box_wrapper/box_wrapper";
import {immutableDelete, immutableInsert, immutableReplace} from "../../../../../../methods/utils/array_utils";
import SelectLotQuantity from "./select_lot_quantity/select_lot_quantity";
import MergeReview from "./merge_review/merge_review";
import LotEditor from "../../../../../side_bar/content/cards/editors/card_editor/lot_editor";
import BackButton from "../../../../../basic/back_button/back_button";
import {isShift} from "../../../../../../methods/utils/event_utils";
import useScrollInfo from "../../../../../../hooks/useScrollInfo";
import {moveLot} from "../../../../../../methods/utils/lot_utils";

// Modal.setAppElement('body');

const CONTENT_OPTIONS = {
    SELECTING_LOTS: 'SELECTING_LOTS',
    SELECTING_LOT_QUANTITIES: 'SELECTING_LOT_QUANTITIES',
    REVIEW: 'REVIEW',
    CREATE_NEW_LOT: 'CREATE_NEW_LOT',
}

const MergeModal = (props) => {

    const {
        stationId,
        dashboardId,
        close,
    } = props

    const dispatch = useDispatch()
    const dispatchPutCard = async (card, ID) => await dispatch(putCard(card, ID))

    const availableFinishProcesses = useSelector(state => { return state.dashboardsReducer.finishEnabledDashboards[dashboardId] })
    const availableKickOffProcesses = useSelector(state => { return state.dashboardsReducer.kickOffEnabledDashboards[dashboardId] })
    const processCards = useSelector(state => { return state.cardsReducer.processCards })
    const cards = useSelector(state => { return state.cardsReducer.cards }) || {}

    const [scrollInfo, setRef] = useScrollInfo()
    const [availableLots, setAvailableLots] = useState([])
    const [lotPositions, setLotPositions] = useState([])
    const [selectedLots, setSelectedLots] = useState([])
    const [content, setContent] = useState(CONTENT_OPTIONS.SELECTING_LOTS)
    const [quantityOptions, setQuantityOptions] = useState([])
    const [optionsInitialIndex, setOptionsInitialIndex] = useState(0)
    const [subTitle, setSubTitle] = useState('')
    const [shift, setShift] = useState(false)

    useEffect(() => {

        let tempAvailableCards = []
        availableFinishProcesses.forEach((finishProcessId) => {
            const currentCards = processCards[finishProcessId]
            // console.log('currentCards',currentCards)
            const finishedCards = Object.values(currentCards).filter((card) => card?.bins[stationId]?.count > 0)
            tempAvailableCards = tempAvailableCards.concat(finishedCards)

        })

        setAvailableLots(tempAvailableCards)

        return () => {
        };
    }, [availableFinishProcesses]);

    const  rectanglesIntersect = ({minX: minAx, minY: minAy, maxX: maxAx, maxY: maxAy}, {minX: minBx, minY: minBy, maxX: maxBx, maxY: maxBy} ) => {
         const aLeftOfB = maxAx < minBx;
         const aRightOfB = minAx > maxBx;
         const aAboveB = minAy > maxBy;
         const aBelowB = maxAy < minBy;

        return !( aLeftOfB || aRightOfB || aAboveB || aBelowB );
    }

    const handleSelectionChange = useCallback((box) => {
        const {
            height,
            left,
            top,
            width,
        } = box || {}

        const reformattedBox = {
            minX: left,
            minY: top + parseInt(scrollInfo?.y?.value),
            maxX: left + width,
            maxY: top + height + parseInt(scrollInfo?.y?.value)
        }

        let tempSelected = []
        let firstIsAdd = false
        lotPositions.forEach(((currPosition, currIndex) => {
            const {offsetHeight, offsetLeft, offsetTop, offsetWidth} = currPosition || {}

            const reformattedPosition = {
                minX: offsetLeft,
                minY: offsetTop,
                maxX: offsetLeft + offsetWidth,
                maxY: offsetTop + offsetHeight
            }


            if(rectanglesIntersect(reformattedBox, reformattedPosition)) {
                let itemIndex = selectedLots.indexOf(currIndex)
                if(itemIndex !== -1 && currIndex === 0) {

                }
                else {

                }
                tempSelected.push(currIndex)
            }
        }))


        if(shift) {

        }
        setSelectedLots(prevState => {
            // if(shift) {
                return [...prevState.filter(item => tempSelected.indexOf(item) === -1), ...tempSelected]
            // }
            // else {
            //     return tempSelected
            // }
        })
    },[lotPositions, shift, scrollInfo, scrollInfo?.y?.value])


    // const { DragSelection } = useCallback(
    //     useSelectionContainer({
    //         onSelectionChange: handleSelectionChange,
    //         onSelectionEnd: (ayo) => {
    //             console.log('ayo',ayo)
    //         },
    //         onSelectionStart: (stuff) => {
    //             console.log('stuff',stuff)
    //         },
    //         selectionProps: {
    //             style: {
    //                 border: 'none',
    //                 borderRadius: 4,
    //                 backgroundColor: 'red',
    //                 opacity: 0.5,
    //                 zIndex: 2000
    //             },
    //         }
    //         // isEnabled,
    //         // selectionProps,
    //         // eventsElement,
    //
    //     })
    //     , [])

    // useEffect(() => {
    //     console.log('DragSelection',DragSelection)
    //     return () => {
    //     };
    // }, [DragSelection]);

    useEffect(() => {
        switch(content) {
            case CONTENT_OPTIONS.SELECTING_LOTS: {
                setSubTitle('Select Lots to Merge')
                break
            }
            case CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES: {
                setSubTitle('Select Lot Quantities')
                break
            }
            case CONTENT_OPTIONS.REVIEW: {
                setSubTitle('Review')
                break
            }
            case CONTENT_OPTIONS.CREATE_NEW_LOT: {
                setSubTitle('Create New Low')
                break
            }
            default: {
                setSubTitle('')
                break
            }

        }

        return () => {};
    }, [content]);

    const onShift = useCallback((e) => {
        if(isShift(e)) {
            setShift(true)
        }
        else {
            setShift(false)
        }

    }, [])

    useEffect(() => {
        document.addEventListener("mousemove", onShift);

        // on dismount remove the event pasteListener
        return () => {
            document.removeEventListener("mousemove", onShift);
        };
    }, [])






    const handleResize = ({offsetHeight, offsetLeft, offsetTop, offsetWidth}, index) => {
        setLotPositions((prev) => immutableReplace(prev, {offsetHeight, offsetLeft, offsetTop, offsetWidth}, index))
    }

    const renderLots = () => {
        return availableLots.map((lot, ind) => {

            const {
                _id: lotId,
            } = lot || {}

            return (
                <BoxWrapper
                    containerStyle={{
                        display: 'flex',
                        // margin: ".5rem",
                        alignSelf: 'stretch',
                        height: 'auto',
                        // background: 'rgba(255,0,0,0.2)',
                        width: '30rem'
                    }}
                    sizeCb={(args) => handleResize(args, ind)}
                >
                    <LotContainer
                        selectable={selectedLots.length > 0}
                        isSelected={selectedLots.includes(ind)}
                        lotId={lotId}
                        onClick={() => {
                            const itemIndex = selectedLots.indexOf(ind)
                            let updated
                            if(itemIndex !== -1) {
                                updated = immutableDelete(selectedLots, itemIndex)
                            }
                            else {
                                updated = immutableInsert(selectedLots, ind, selectedLots.length)
                            }
                            setSelectedLots(updated)
                        }}
                        binId={stationId}
                        enableFlagSelector={false}
                        containerStyle={{
                            margin: ".5rem", alignSelf: 'stretch', height: 'auto', width: '100%'
                        }}
                    />
                </BoxWrapper>
            )
        })
    }

    return (
        <styled.Container
            isOpen={true}
            contentLabel="Kick Off Modal"
            onRequestClose={close}
            style={{
                overlay: {
                    zIndex: 500,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
            }}
        >
            <styled.Header>
                {content !== CONTENT_OPTIONS.SELECTING_LOTS &&

                <BackButton
                    containerStyle={{
                        position: 'absolute',
                        margin: 0,
                        padding: 0
                    }}
                    onClick={() => {
                        switch(content) {
                            case CONTENT_OPTIONS.SELECTING_LOTS: {
                                break
                            }
                            case CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES: {
                                setContent(CONTENT_OPTIONS.SELECTING_LOTS)
                                break
                            }
                            case CONTENT_OPTIONS.REVIEW: {
                                setContent(CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES)
                                break
                            }
                            case CONTENT_OPTIONS.CREATE_NEW_LOT: {
                                break
                            }
                            default: {
                                break
                            }

                        }
                    }}
                />
                }

                <styled.Column style={{margin: 'auto'}}>
                    <styled.Title>Merge Lots</styled.Title>
                    <styled.SubTitle>{subTitle}</styled.SubTitle>
                </styled.Column>

                <styled.CloseButton
                    className={'fas fa-times'}
                    color={'red'}
                    onClick={close}
                />

            </styled.Header>

            <styled.BodyContainer>
                {
                    {
                        [CONTENT_OPTIONS.SELECTING_LOTS]:
                            <>
                                {/*<DragSelection/>*/}
                                <styled.LotListContainer
                                    ref={setRef}
                                >
                                    {renderLots()}
                                </styled.LotListContainer>
                            </>,
                        [CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES]:
                            <SelectLotQuantity
                                stationId={stationId}
                                initialValues={quantityOptions}
                                initialIndex={optionsInitialIndex}
                                selectedLots={selectedLots.map(lotIndex => availableLots[lotIndex])}
                                onSubmit={(values) => {
                                    setOptionsInitialIndex(0)
                                    setContent(CONTENT_OPTIONS.REVIEW)
                                    setQuantityOptions(values)
                                }}
                            />,
                        [CONTENT_OPTIONS.REVIEW]:
                            <MergeReview
                                quantityOptions={quantityOptions}
                                onOptionClick={(index) => {
                                    setContent(CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES)
                                    setOptionsInitialIndex(index)
                                }}
                                onNext={() => {
                                    setContent(CONTENT_OPTIONS.CREATE_NEW_LOT)
                                }}
                            />,
                        [CONTENT_OPTIONS.CREATE_NEW_LOT]:
                            <LotEditorContainer
                                initialBin={stationId}
                                binId={stationId}
                                processOptions={availableKickOffProcesses}
                                onSubmit={() => {
                                    quantityOptions.forEach(option => {
                                        const {lotId, quantity} = option || {}
                                        const updatedLot = moveLot(cards[lotId], FINISH_BIN_ID, stationId, quantity)
                                        dispatchPutCard(updatedLot, lotId)
                                    })
                                    close()
                                }}
                                isOpen={true}
                                onAfterOpen={null}
                                cardId={null}
                                processId={null}
                                close={()=>{
                                    setContent(CONTENT_OPTIONS.REVIEW)
                                }}

                            />,

                    }[content] ||
                    null
                }

            </styled.BodyContainer>

            {content === CONTENT_OPTIONS.SELECTING_LOTS &&
            <styled.Footer>
                <Button
                    disabled={!(selectedLots.length > 0)}
                    onClick={() => {
                        switch(content) {
                            case CONTENT_OPTIONS.SELECTING_LOTS: {
                                setContent(CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES)
                            }
                            case CONTENT_OPTIONS.SELECTING_LOT_QUANTITIES: {

                            }
                        }
                    }}
                    label={'Select Quantities'}
                />
            </styled.Footer>
            }
        </styled.Container>
    );
};

MergeModal.propTypes = {

};

// Specifies the default values for props:
MergeModal.defaultProps = {

};

export default MergeModal
