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

	const [name, setName] = useState()
	const [deposit, setDeposit] = useState()
	const [totalCost, setTotalCost] = useState()
	const [startsAt, setStartAt] = useState()
	const [endsAt, setEndsAt] = useState()
	const [loading, setLoading] = useState()

	// Get Work Plans
	useEffect(() => {
		// Set page
		props.setPage({
			name: "Add Work Plan Item",
			path: ["projects", `projects/${id}/view`, "create"],
		})
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/work-plans", {
			projectId: id,
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
				// Redirect to Work Plans
				setTimeout(() => history.push(`/admin/erp/projects/${id}/view`), 500)
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

					{/* Deposit */}
					<label htmlFor="">Deposit</label>
					<input
						type="number"
						placeholder="2000"
						className="form-control mb-2 me-2"
						onChange={(e) => setDeposit(e.target.value)}
						required={true}
					/>
					{/* Deposit */}

					{/* Total Cost */}
					<label htmlFor="">Total Cost</label>
					<input
						type="number"
						placeholder="20000"
						className="form-control mb-2 me-2"
						onChange={(e) => setTotalCost(e.target.value)}
						required={true}
					/>
					{/* Total Cost */}

					<div className="d-flex justify-content-between mb-2">
						<div>
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
						</div>
						<div>
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
						</div>
					</div>

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add work plan item"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center">
						<MyLink
							linkTo={`/erp/projects/${id}/view`}
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
