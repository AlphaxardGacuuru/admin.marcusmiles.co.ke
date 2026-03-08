import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import CloseSVG from "@/svgs/CloseSVG"
import BackSVG from "@/svgs/BackSVG"

const create = (props) => {
	var { id } = useParams()
	var history = useHistory()

	const [serviceProviders, setServiceProviders] = useState([])

	const [serviceProviderId, setServiceProviderId] = useState()
	const [labourRate, setLabourRate] = useState()
	const [quantityOfWork, setQuantityOfWork] = useState()
	const [totalAmount, setTotalAmount] = useState()
	const [service, setService] = useState()
	const [status, setStatus] = useState()
	const [startDate, setStartDate] = useState()
	const [endDate, setEndDate] = useState()

	const [loading, setLoading] = useState()

	var statuses = [
		{ id: "began", name: "Began" },
		{ id: "ongoing", name: "Ongoing" },
		{ id: "completed", name: "Completed" },
		{ id: "repairs", name: "Repairs" },
		{ id: "incomplete", name: "Incomplete" },
	]

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Add Service Provider",
			path: ["service-providers", "create"],
		})
		props.get("service-providers", setServiceProviders)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.post("/api/project-service-providers", {
			projectId: id,
			serviceProviderId: serviceProviderId,
			labourRate: labourRate,
			quantityOfWork: quantityOfWork,
			totalAmount: totalAmount,
			service: service,
			status: status,
			startDate: startDate,
			endDate: endDate,
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Redirect to ServiceProvider
				setTimeout(() => history.push(`/admin/erp/projects/${id}/view`), 500)
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	return (
		<form onSubmit={onSubmit}>
			<div className="row">
				<div className="col-sm-2"></div>
				<div className="col-sm-4">
					{/* Service Provider Start */}
					<label htmlFor="">Service Provider</label>
					<select
						className="form-control mb-2 me-2"
						onChange={(e) => setServiceProviderId(e.target.value)}
						required={true}>
						{[{ id: "", name: "Select Service Provider" }]
							.concat(serviceProviders)
							.map((serviceProvider, key) => (
								<option
									key={key}
									value={serviceProvider.id}>
									{serviceProvider.name}
								</option>
							))}
					</select>
					{/* Service Provider End */}

					{/* Labour Rate Start */}
					<label htmlFor="">Labour Rate (per day)</label>
					<input
						type="number"
						placeholder="800"
						className="form-control mb-2 me-2"
						onChange={(e) => setLabourRate(e.target.value)}
						required={true}
					/>
					{/* Labour Rate End */}

					{/* Quantity of Work Start */}
					<label htmlFor="">Quantity of Work (per M&sup2;)</label>
					<input
						type="number"
						placeholder="12"
						className="form-control mb-2 me-2"
						onChange={(e) => setQuantityOfWork(e.target.value)}
						required={true}
					/>
					{/* Quantity of Work End */}

					{/* Total Amount Start */}
					<label htmlFor="">Total Amount</label>
					<input
						type="number"
						placeholder="800"
						className="form-control mb-2 me-2"
						onChange={(e) => setTotalAmount(e.target.value)}
						required={true}
					/>
					{/* Total Amount End */}
				</div>
				<div className="col-sm-4">
					{/* Service Start */}
					<label htmlFor="">Service</label>
					<input
						type="text"
						placeholder="Plumbing"
						className="form-control mb-2 me-2"
						onChange={(e) => setService(e.target.value)}
						required={true}
					/>
					{/* Service End */}

					{/* Status Start */}
					<label htmlFor="">Status</label>
					<select
						className="form-control mb-2 me-2"
						onChange={(e) => setStatus(e.target.value)}
						required={true}>
						{[{ id: "", name: "Select Status" }]
							.concat(statuses)
							.map((status, key) => (
								<option
									key={key}
									value={status.id}>
									{status.name}
								</option>
							))}
					</select>
					{/* Status End */}

					{/* Start Date Start */}
					<label htmlFor="">Start Date</label>
					<input
						type="date"
						className="form-control mb-2 me-2"
						onChange={(e) => setStartDate(e.target.value)}
						required={true}
					/>
					{/* Start Date End */}

					{/* End Date Start */}
					<label htmlFor="">End Date</label>
					<input
						type="date"
						className="form-control mb-2 me-2"
						onChange={(e) => setEndDate(e.target.value)}
						required={true}
					/>
					{/* End Date End */}
				</div>
				<div className="col-sm-2"></div>
			</div>

			<div className="row">
				<div className="col-sm-2"></div>
				<div className="col-sm-8">
					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="add service provider"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/erp/projects/${id}/view`}
							icon={<BackSVG />}
							text="back to service provider"
						/>
					</div>
				</div>
				<div className="col-sm-2"></div>
			</div>
		</form>
	)
}

export default create
