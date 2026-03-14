import React from "react"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

import Line from "@/components/Charts/Line"

import ArrowDownSVG from "@/svgs/ArrowDownSVG"
import ArrowUpSVG from "@/svgs/ArrowUpSVG"
import DashSVG from "@/svgs/DashSVG"

const ChartBox = (props) => {
	return (
		<div
			className="m-1 me-4 p-2 card"
			style={{ width: "19.5em", height: "auto" }}>
			<div className="d-flex justify-content-between align-items-center">
				<Link
					to={props.link}
					className="text-decoration-none text-dark">
					<h4>{props.title}</h4>
					<h6>{props.total}</h6>
				</Link>
				<div
					className="fs-2 shadow rounded-circle text-white px-3 py-2"
					style={{
						backgroundColor: props.datasets[0].backgroundColor,
					}}>
					{props.icon}
				</div>
			</div>
			<div className="d-flex justify-content-end align-items-center">
				<div className="mt-1">
					<h6>
						{props.growth > 0 && (
							<span className="text-success">
								<ArrowUpSVG />
								{props.growth}
							</span>
						)}
						{props.growth == 0 && (
							<span className="text-warning">
								<DashSVG />
								{props.growth}
							</span>
						)}
						{props.growth < 0 && (
							<span className="text-danger">
								<ArrowDownSVG />
								{props.growth}
							</span>
						)}
					</h6>
				</div>
			</div>
			<div className="d-flex justify-content-end align-items-center">
				{props.data && (
					<Line
						labels={[1, 2, 3, 4, 5, 6, 7]}
						datasets={props.datasets}
					/>
				)}
			</div>
		</div>
	)
}

export default ChartBox
