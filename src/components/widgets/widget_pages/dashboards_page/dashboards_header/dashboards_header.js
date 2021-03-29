import React, { useState, useMemo } from 'react';

// functions external
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

// components internal
import BackButton from '../../../../basic/back_button/back_button';
import Button from '../../../../basic/button/button';
import SimpleLot from "../dashboard_screen/simple_lot/simple_lot";

// hooks internal
import useWindowSize from '../../../../../hooks/useWindowSize';

// utils
import {getBinQuantity, getIsCardAtBin} from "../../../../../methods/utils/lot_utils";

// styles
import * as style from './dashboards_header.style';

const widthBreakPoint = 1000;

const DashboardsHeader = (props) => {

    const {
        children,
        showTitle,
        showBackButton,
        showEditButton,
        showSaveButton,
        setEditingDashboard,
        page,
        saveDisabled,
        onBack,
    } = props

    // extract url params
    const { stationID } = props.match.params

    const cards = useSelector(state => state.cardsReducer.cards)
    const stations = useSelector(state => state.stationsReducer.stations)
    const positions = useSelector(state => state.positionsReducer.positions)

    const [moreLots, setMoreLots] = useState(false);

    const locations = {
        ...positions,
        ...stations
    }

    const location = locations[stationID]
    const size = useWindowSize()
    const windowWidth = size.width
    const mobileMode = windowWidth < widthBreakPoint;

    /**
     * Renders Lots that are are the station
     */
    const renderLotsTitle = useMemo(() => {

        //  If there is a location then see if it has lots. There wouldnt be a location because its a Mir dashboard
        if (location === undefined) return

        let hasLot = false

        for (let i = 0; i < Object.values(cards).length; i++) {
            if (!!Object.values(cards)[i].bins[location.id]) {
                hasLot = true
                break
            }
        }

        if (!!hasLot) {
            return (
                <style.LotsContainer moreLots={moreLots}>
                    <style.RowContainer windowWidth={windowWidth} style={{height: moreLots ? '' : '3.8rem'}}>
                        <style.LotsTitle>Lots:</style.LotsTitle>
                        {Object.values(cards)
                            .filter((card, ind) => {
                                return getIsCardAtBin(card, location?.id)
                            })
                            .map((card) => {
                                const {
                                    name,
                                    lotNumber,
                                    bins,
                                    id
                                } = card || {}

                                const quantity = getBinQuantity({bins}, location?.id)

                                return(
                                    <SimpleLot
                                        key={id}
                                        name={name}
                                        lotNumber={lotNumber}
                                        quantity={quantity}
                                    />
                                )
                            })}
                            
                    </style.RowContainer>
                    <style.MoreIcon className='fas fa-ellipsis-h' onClick={() => setMoreLots(!moreLots)}/>
                </style.LotsContainer>
            )
        }

        else {
            return (
                <style.RowContainer>
                    <style.LotsTitle>No Lots</style.LotsTitle>
                </style.RowContainer>
            )
        }
    }, [cards])

    return (
        <style.ColumnContainer>

            {renderLotsTitle}

            <style.Header>

                {showBackButton &&
                <BackButton style={{ order: '1' }} containerStyle={{  }}
                            onClick={onBack}
                />
                }

                {showTitle &&
                <style.Title style={{ order: '2' }}>{page}</style.Title>
                }

                {showEditButton && !mobileMode &&
                <Button style={{ order: '3', position: 'absolute', right: '0', marginRight: '0' }}
                        onClick={setEditingDashboard}
                        secondary
                >
                    Edit Dashboard
                </Button>
                }

                {showSaveButton &&
                <>
                    <Button style={{ order: '3', minWidth: '10rem' }}
                            type='submit'
                            disabled={saveDisabled}
                            schema="dashboards"
                    >
                        Save
                    </Button>

                    {/* Comment out for now since locations only have one dashboard, so you should not be able to delete the only dashboard */}
                    {/* <Button
                          schema={'delete'}
                          style={{ order: '4', marginTop: '1.8rem', marginLeft: '2rem' }}
                          onClick={onDelete}
                      >
                          Delete
                      </Button> */}
                </>
                }

                {children}
            </style.Header>
        </style.ColumnContainer>

    )
}

export default withRouter(DashboardsHeader)
