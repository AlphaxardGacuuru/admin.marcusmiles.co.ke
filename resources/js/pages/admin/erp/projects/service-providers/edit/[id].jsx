import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import CloseSVG from "@/svgs/CloseSVG"
import BackSVG from "@/svgs/BackSVG"

const edit = (props) => {
	var { id } = useParams()

	const [projectServiceProvider, setProjectServiceProvider] = useState({})

	const [serviceProviders, setServiceProviders] = useState([])

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
			name: "Edit Service Provider",
			path: ["service-providers", "edit"],
		})
		// Fetch ServiceProvider
		props.get(`project-service-providers/${id}`, setProjectServiceProvider)
		props.get("service-providers", setServiceProviders)
	}, [])

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/project-service-providers/${id}`, {
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
						onChange={(e) => setProjectServiceProvider(e.target.value)}
						disabled={true}>
						{[{ id: "", name: "Select Service Provider" }]
							.concat(serviceProviders)
							.map((serviceProvider, key) => (
								<option
									key={key}
									value={serviceProvider.id}
									selected={
										serviceProvider.id ==
										projectServiceProvider.serviceProviderId
									}>
									{serviceProvider.name}
								</option>
							))}
					</select>
					{/* Service Provider End */}

					{/* Labour Rate Start */}
					<label htmlFor="">Labour Rate (per Day)</label>
					<input
						type="number"
						placeholder="800"
						defaultValue={projectServiceProvider.labourRate}
						className="form-control mb-2 me-2"
						onChange={(e) => setLabourRate(e.target.value)}
					/>
					{/* Labour Rate End */}

					{/* Quantity of Work Start */}
					<label htmlFor="">Quantity of Work (per M&sup2;)</label>
					<input
						type="number"
						placeholder="12"
						defaultValue={projectServiceProvider.quantityOfWork}
						className="form-control mb-2 me-2"
						onChange={(e) => setQuantityOfWork(e.target.value)}
					/>
					{/* Quantity of Work End */}

					{/* Total Amount Start */}
					<label htmlFor="">Total Amount</label>
					<input
						type="number"
						placeholder="800"
						defaultValue={projectServiceProvider.totalAmount}
						className="form-control mb-2 me-2"
						onChange={(e) => setTotalAmount(e.target.value)}
					/>
					{/* Total Amount End */}
				</div>
				<div className="col-sm-4">
					{/* Service Start */}
					<label htmlFor="">Service</label>
					<input
						type="text"
						placeholder="Plumbing"
						defaultValue={projectServiceProvider.service}
						className="form-control mb-2 me-2"
						onChange={(e) => setService(e.target.value)}
					/>
					{/* Service End */}

					{/* Status Start */}
					<label htmlFor="">Status</label>
					<select
						className="form-control mb-2 me-2"
						onChange={(e) => setStatus(e.target.value)}>
						{[{ id: "", name: "Select Status" }]
							.concat(statuses)
							.map((status, key) => (
								<option
									key={key}
									value={status.id}
									selected={status.id == projectServiceProvider.status}>
									{status.name}
								</option>
							))}
					</select>
					{/* Status End */}

					{/* Start Date Start */}
					<label htmlFor="">Start Date</label>
					<input
						type="date"
						defaultValue={projectServiceProvider.startDateRaw}
						className="form-control mb-2 me-2"
						onChange={(e) => setStartDate(e.target.value)}
					/>
					{/* Start Date End */}

					{/* End Date Start */}
					<label htmlFor="">End Date</label>
					<input
						type="date"
						defaultValue={projectServiceProvider.endDateRaw}
						className="form-control mb-2 me-2"
						onChange={(e) => setEndDate(e.target.value)}
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
							text="update service provider"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/erp/projects/${projectServiceProvider.projectId}/view`}
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

export default edit
