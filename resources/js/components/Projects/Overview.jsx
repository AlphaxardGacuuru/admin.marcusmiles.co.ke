import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"

const Overview = (props) => {
	const ctx = useRef()

	/*
	 * Colors
	 */
	let colors = [
		"rgba(255, 99, 132, 1)", // RED
		"rgba(255, 159, 64, 1)", // ORANGE
		"rgba(255, 205, 86, 1)", // YELLOW
		"rgba(75, 192, 192, 1)", // TEAL
		"rgba(54, 162, 235, 1)", // BLUE
		"rgba(153, 102, 255, 1)", // PURPLE
		"rgba(201, 203, 207, 1)", // GREY
		"rgba(24, 135, 84, 1)", // GREEN
	]

	let datasets = props.workPlanChart.data
		.map((workPlan, key) => {
			let workPlanSteps = workPlan.work_plan_steps.map((workPlanStep) => ({
				...workPlanStep,
				colorKey: key,
			}))

			return [{ ...workPlan, colorKey: key }, ...workPlanSteps]
		})
		.flat()

	const config = {
		type: "line",
		data: {
			labels: props.workPlanChart.labels,
			datasets: datasets.map((workPlan) => ({
				label: workPlan.name,
				data: workPlan.data,
				backgroundColor: colors[workPlan.colorKey],
				borderColor: colors[workPlan.colorKey],
				borderWidth: 2,
			})),
		},
		options: {
			responsive: true,
			scales: {
				x: {
					display: true,
					position: "bottom",
				},
				y: {
					display: false,
				},
			},
			plugins: {
				legend: {
					position: "left",
				},
			},
		},
	}

	useEffect(() => {
		new Chart(ctx.current, config)
	}, [])

	var totalCosts = props.workPlans.data
		?.reduce((acc, workPlan) => acc + Number(workPlan.totalCost), 0)
		.toLocaleString()

	return (
		<div className={props.activeTab}>
			<div className="card rounded m-1 me-4 p-2">
				{props.workPlanChart.labels && (
					<div
						className="p-2"
						style={{ width: "100%", height: "auto" }}>
						<canvas ref={ctx}></canvas>
					</div>
				)}
				<table className="table table-hover table-bordered mt-5">
					<thead>
						<tr>
							<th></th>
							{props.workPlans.data?.map((workPlan, key) => (
								<th
									key={key}
									style={{ backgroundColor: colors[key] }}>
									{workPlan.name}
								</th>
							))}
							<th></th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<small>Total Cost for Milestone</small>
							</td>
							{props.workPlans.data?.map((workPlan, key) => (
								<td key={key}>
									KES {Number(workPlan.totalCost)?.toLocaleString()}
								</td>
							))}
							<td>
								<small>KES {totalCosts}</small>
							</td>
						</tr>
						<tr>
							<td>
								<small>Percentage payment per milestone</small>
							</td>
							{props.workPlans.data?.map((workPlan, key) => (
								<td key={key}>
									<div className="d-flex justify-content-between">
										<div>
											{((workPlan.deposit / workPlan.totalCost) * 100).toFixed(1)}%
										</div>
										<div>
											{(((workPlan.totalCost - workPlan.deposit) /
												workPlan.totalCost) *
												100).toFixed(1)}
											%
										</div>
									</div>
								</td>
							))}
							<td>
								<small>100% Retainer Balance</small>
							</td>
						</tr>
						<tr>
							<td>
								<small>Payment per milestone</small>
							</td>
							{props.workPlans.data?.map((workPlan, key) => (
								<td key={key}>
									<div className="d-flex justify-content-between">
										<div>KES {Number(workPlan.deposit).toLocaleString()}</div>
										<div>
											KES{" "}
											{Number(
												workPlan.totalCost - workPlan.deposit
											).toLocaleString()}
										</div>
									</div>
								</td>
							))}
							<td>
								<small>KES {totalCosts}</small>
							</td>
						</tr>
						<tr>
							<td>
								<small>Due Date</small>
							</td>
							{props.workPlans.data?.map((workPlan, key) => (
								<td key={key}>{workPlan.endsAt}</td>
							))}
							<td>
								<small>
									{props.workPlans.data?.reduce(
										(acc, workPlan) => workPlan.endsAt, 0
									)}
								</small>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	)
}

Overview.propTypes = {}

export default Overview
