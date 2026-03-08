import ForwardSVG from "@/svgs/ForwardSVG"
import React, { useState } from "react"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const index = (props) => {
	return (
		<div
			className="row bg-white py-5"
			style={{ minHeight: "100vh" }}>
			<div className="col-sm-12 text-center py-5">
				<h1 className="my-5">Marcus Miles Consult</h1>
				<Link
					to="/admin/dashboard"
					className="btn sonar-btn w-25 mx-auto">
					<span className="me-1">visit dashboard</span>
					<ForwardSVG />
				</Link>
			</div>
		</div>
	)
}

export default index
