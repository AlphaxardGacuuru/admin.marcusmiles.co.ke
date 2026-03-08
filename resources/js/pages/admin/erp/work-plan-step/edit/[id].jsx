import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"
import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [workPlanStep, setWorkPlanStep] = useState({})

	const [name, setName] = useState()
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
		Axios.get(`api/work-plan-steps/${id}`).then((res) => {
			// Set page
			props.setPage({
				name: "Edit Work Plan",
				path: [
					"projects",
					`projects/${res.data.data.projectId}/show`,
					"edit",
				],
			})

			setWorkPlanStep(res.data.data)
		})
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/work-plan-steps/${id}`, {
			name: name,
			startsAt: startsAt,
			endsAt: endsAt,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Fetch Work Plan
				props.get(`work-plan-steps/${id}`, setWorkPlanStep)
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
					<label htmlFor="">Name</label>
					<input
						type="text"
						placeholder="A1"
						defaultValue={workPlanStep.name}
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
					/>

					{/* Starts At */}
					<label htmlFor="">Starts At</label>
					<input
						type="date"
						placeholder="A1"
						defaultValue={workPlanStep.startsAtRaw}
						className="form-control mb-2 me-2"
						onChange={(e) => setStartAt(e.target.value)}
					/>
					{/* Starts At */}

					{/* Ends At */}
					<label htmlFor="">Ends At</label>
					<input
						type="date"
						placeholder="A1"
						defaultValue={workPlanStep.endsAtRaw}
						className="form-control mb-2 me-2"
						onChange={(e) => setEndsAt(e.target.value)}
					/>
					{/* Ends At */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update"
							loading={loading}
						/>
					</div>

					<center>
						<MyLink
							linkTo={`/erp/projects/${workPlanStep.projectId}/view`}
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
