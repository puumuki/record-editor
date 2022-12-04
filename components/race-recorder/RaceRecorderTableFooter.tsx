import { Record } from '../../types/types'
import TimeView from '../TimeView'

interface RaceRecorderTableFooterProps {
  records: Record[]
}

const RaceRecorderTableFooter = (props: RaceRecorderTableFooterProps): React.ReactElement => {
  const trackTotalPlayTime = props.records.reduce((accumulator, record) => {
    return accumulator + record.time
  }, 0)

  return (
    <tfoot>
      <tr>
        <th>Kokonaisajoaika</th>
        <th>Ajokerrat</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
      <tr>
        <th>
          <TimeView seconds={trackTotalPlayTime}></TimeView>
        </th>
        <th>{props.records.length}</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </tfoot>
  )
}

export default RaceRecorderTableFooter
