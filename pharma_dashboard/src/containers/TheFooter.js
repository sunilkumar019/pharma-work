import React from 'react'
import { CFooter } from '@coreui/react'
import moment from 'moment';

const TheFooter = () => {
  const year = moment().year();

  return (
    <CFooter fixed={false}>
      <div className="mfs-auto">
        <span className="mr-1">ALL rights Reserved © {year} </span>
        <a target="_blank" rel="noreferrer" href="https://www.webhopers.com/"><b style={{color:"#126cdc"}}>Web</b><b style={{color:"#ff7713"}}>Hopers</b></a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
