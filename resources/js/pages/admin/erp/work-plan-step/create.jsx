import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"
import BackSVG from "@/svgs/BackSVG"

const create = (props) => {
	var history = useHistory()
	var { id } = useParams()

	const [workPlan, setWorkPlan] = useState({})
	const [name, setName] = useState()
	const [startsAt, setStartAt] = useState()
	const [endsAt, setEndsAt] = useState()
	const [loading, setLoading] = useState()

	// Get Work Plans
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Add Work Plan Step Item",
			path: ["projects"],
		})

		// Fetch Work Plan
		Axios.get(`api/work-plans/${id}`)
			.then((res) => {
				setWorkPlan(res.data.data)
				// Set page
				props.setPage({
					name: "Add Work Plan Step Item",
					path: ["projects", `projects/${res.data.data.projectId}/view`, "create"],
				})
			})
			.catch((err) => props.getErrors(err))
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/work-plan-steps", {
			workPlanId: id,
			name: name,
			startsAt: startsAt,
			endsAt: endsAt,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Redirect to Work Plans
				setTimeout(() => history.push(`/admin/erp/projects/${workPlan.projectId}/view`), 500)
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
						className="form-control mb-2 me-2"
						onChange={(e) => setName(e.target.value)}
						required={true}
					/>
					{/* Name */}

					{/* Starts At */}
					<label htmlFor="">Starts At</label>
					<input
						type="date"
						placeholder="A1"
						className="form-control mb-2 me-2"
						onChange={(e) => setStartAt(e.target.value)}
						required={true}
					/>
					{/* Starts At */}

					{/* Ends At */}
					<label htmlFor="">Ends At</label>
					<input
						type="date"
						placeholder="A1"
						className="form-control mb-2 me-2"
						onChange={(e) => setEndsAt(e.target.value)}
						required={true}
					/>
					{/* Ends At */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add sub step item"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/erp/projects/${workPlan.projectId}/view`}
							icon={<BackSVG />}
							text="back to projects"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default create
