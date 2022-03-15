import React from 'react'
import { Link } from 'react-router-dom'
const Page404 = () => {
  return (
    <section className="page_404">
      <div className="container">
        <div className="row">
          <div className="col-sm-12 ">
            <div className="col-sm-12 col-sm-offset-1  text-center">
              <div className="four_zero_four_bg">
              </div>
              <div className="contant_box_404">
                <h3 className="h2">
                  No Data Found
		           </h3>
                <p>Look like you're lost !</p>
                <Link to='/' className="link_404">Go to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Page404
