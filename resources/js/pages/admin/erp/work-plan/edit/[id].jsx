import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"
import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [workPlan, setWorkPlan] = useState({})

	const [name, setName] = useState()
	const [deposit, setDeposit] = useState()
	const [totalCost, setTotalCost] = useState()
	const [startsAt, setStartAt] = useState()
	const [endsAt, setEndsAt] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Work Plan",
			path: ["projects", "edit"],
		})

		// Fetch Work Plan
		Axios.get(`api/work-plans/${id}`).then((res) => {
			// Set page
			props.setPage({
				name: "Edit Work Plan",
				path: ["projects", `projects/${res.data.data.projectId}/show`, "edit"],
			})

			setWorkPlan(res.data.data)
		})
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/work-plans/${id}`, {
			name: name,
			deposit: deposit,
			totalCost: totalCost,
			startsAt: startsAt,
			endsAt: endsAt,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Fetch Work Plan
				props.get(`work-plans/${id}`, setWorkPlan)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form
					onSubmit={onSubmit}
					className="mb-5">
					{/* Name */}
					<label htmlFor="">Name</label>
					<input
						type="text"
						placeholder="A1"
						defaultValue={workPlan.name}
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
					/>
					{/* Name */}

					{/* Deposit */}
					<label htmlFor="">Deposit</label>
					<input
						type="number"
						placeholder="2000"
						defaultValue={workPlan.deposit}
						className="form-control mb-2 me-2"
						onChange={(e) => setDeposit(e.target.value)}
					/>
					{/* Deposit */}

					{/* Total Cost */}
					<label htmlFor="">Total Cost</label>
					<input
						type="number"
						placeholder="20000"
						defaultValue={workPlan.totalCost}
						className="form-control mb-2 me-2"
						onChange={(e) => setTotalCost(e.target.value)}
					/>
					{/* Total Cost */}

					<div className="d-flex justify-content-between mb-2">
						<div>
							{/* Starts At */}
							<label htmlFor="">Starts At</label>
							<input
								type="date"
								placeholder="A1"
								defaultValue={workPlan.startsAtRaw}
								className="form-control mb-2 me-2"
								onChange={(e) => setStartAt(e.target.value)}
							/>
							{/* Starts At */}
						</div>
						<div>
							{/* Ends At */}
							<label htmlFor="">Ends At</label>
							<input
								type="date"
								placeholder="A1"
								defaultValue={workPlan.endsAtRaw}
								className="form-control mb-2 me-2"
								onChange={(e) => setEndsAt(e.target.value)}
							/>
							{/* Ends At */}
						</div>
					</div>

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update"
							loading={loading}
						/>
					</div>

					<center>
						<MyLink
							linkTo={`/erp/projects/${workPlan.projectId}/view`}
							icon={<BackSVG />}
							text="back to project"
						/>
					</center>

					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
