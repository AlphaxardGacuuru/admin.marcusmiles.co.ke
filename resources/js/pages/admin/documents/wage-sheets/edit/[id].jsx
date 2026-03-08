import React, { useEffect, useState } from "react"
import {
	useHistory,
	useParams,
} from "react-router-dom/cjs/react-router-dom.min"

import Btn from "@/components/Core/Btn"
import MyLink from "@/components/Core/MyLink"

import BackSVG from "@/svgs/BackSVG"
import CloseSVG from "@/svgs/CloseSVG"

const edit = (props) => {
	const { id } = useParams()
	const history = useHistory()

	// Days of the week
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	]

	const [wageSheet, setWageSheet] = useState({})
	const [projects, setProjects] = useState([])
	const [projectServiceProviders, setProjectServiceProviders] = useState([])
	const [staff, setStaff] = useState([])

	const [projectId, setProjectId] = useState()
	const [projectServiceProviderIds, setProjectServiceProviderIds] = useState([])
	const [paidBy, setPaidBy] = useState()
	const [approvedBy, setApprovedBy] = useState()
	const [startsAt, setStartAt] = useState()
	const [endsAt, setEndsAt] = useState()
	const [loading, setLoading] = useState()

	useEffect(() => {
		// Set page
		props.setPage({
			name: "Edit Wage Sheet",
			path: ["wage-sheets", "edit"],
		})
		// Fetch Wage Sheet
		Axios.get(`api/wage-sheets/${id}`)
			.then((res) => {
				setWageSheet(res.data.data)
				setProjectId(res.data.data.projectId)

				let ids = res.data.data.wageSheetServiceProviders.map(
					(serviceProvider) => ({
						id: serviceProvider.projectServiceProviderId,
						days: serviceProvider.days,
					})
				)

				setProjectServiceProviderIds(ids)
			})
			.catch((err) => props.getErrors(err))
		// Fetch Projects
		props.get("projects?idAndName=true", setProjects)
		// Fetch Project Service Providers
		props.get(
			"project-service-providers?idAndName=true",
			setProjectServiceProviders
		)
		// Fetch Staff
		props.get("staff?idAndName=true", setStaff)
	}, [])

	/*
	 * Handle Service Providers selects
	 */
	const handleServiceProviderIds = (id) => {
		if (id) {
			var exists = projectServiceProviderIds.some(
				(projectServiceProviderId) => projectServiceProviderId.id == id
			)

			var newServiceProviderIds = exists
				? projectServiceProviderIds.filter(
						(projectServiceProviderId) => projectServiceProviderId.id != id
				  )
				: [
						...projectServiceProviderIds,
						{
							id: id,
							days: days.reduce((acc, day) => {
								acc[day] = false
								return acc
							}, {}),
						},
				  ]

			setProjectServiceProviderIds(newServiceProviderIds)
		}
	}

	/*
	 * Handle Checked Days
	 */
	const handleCheckboxChange = (serviceProviderKey, day) => {
		let newServiceProviderIds = projectServiceProviderIds.reduce(
			(acc, projectServiceProviderId, key) => {
				if (key == serviceProviderKey) {
					projectServiceProviderId.days[day] =
						!projectServiceProviderId.days[day]
				}

				acc.push(projectServiceProviderId)

				return acc
			},
			[]
		)

		setProjectServiceProviderIds(newServiceProviderIds)
	}

	/*
	 * Submit Form
	 */
	const onSubmit = (e) => {
		e.preventDefault()

		setLoading(true)
		Axios.put(`/api/wage-sheets/${id}`, {
			projectServiceProviderIds: projectServiceProviderIds,
			paidBy: paidBy,
			approvedBy: approvedBy,
			startsAt: startsAt,
			endsAt: endsAt,
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
		<div className="row">
			<div className="col-sm-4"></div>
			<div className="col-sm-4">
				<form onSubmit={onSubmit}>
					{/* Project Start */}
					<select
						name="projectId"
						className="form-control mb-2"
						onChange={(e) => setProjectId(Number.parseInt(e.target.value))}>
						<option value="">Select Project</option>
						{projects.map((project, key) => (
							<option
								key={key}
								value={project.id}
								selected={project.id == wageSheet.projectId}
								disabled={true}>
								{project.name}
							</option>
						))}
					</select>
					{/* Project End */}
					{/* Service Providers Start */}
					<div className="d-flex w-100">
						<div className="d-flex w-100">
							{/* Select Start */}
							<div className="flex-grow-1">
								<select
									name="projectServiceProviderId"
									className="form-control mb-3 me-2"
									onChange={(e) =>
										handleServiceProviderIds(Number.parseInt(e.target.value))
									}
									disabled={projectServiceProviderIds.length > 0}>
									<option value="">Select Service Provider</option>
									{projectServiceProviders
										.filter(
											(projectServiceProvider) =>
												projectServiceProvider.projectId == projectId
										)
										.map((projectServiceProvider, key) => (
											<option
												key={key}
												value={projectServiceProvider.id}
												className="text-primary"
												selected={
													projectServiceProvider.id ==
													projectServiceProviderIds[0]?.id
												}>
												{projectServiceProvider.serviceProviderName}
											</option>
										))}
								</select>
							</div>
							{/* Days Start */}
							{projectServiceProviderIds.length > 0 && (
								<div className={`text-primary mx-1`}>
									{days.map((day) => (
										<label
											key={day}
											className="text-center mx-1">
											<div>{day.slice(0, 1)}</div>
											<input
												type="checkbox"
												checked={projectServiceProviderIds[0]?.days[day]}
												onChange={() => handleCheckboxChange(0, day)}
											/>
										</label>
									))}
								</div>
							)}
						</div>
						{/* Days End */}
						{/* Close Icon */}
						<span
							className="text-primary my-1"
							style={{ cursor: "pointer" }}
							onClick={() =>
								setProjectServiceProviderIds(
									projectServiceProviderIds.slice(0, 0)
								)
							}>
							<CloseSVG />
						</span>
						{/* Close Icon End */}
					</div>

					{/* Second List Start */}
					{projectServiceProviderIds.map((projectServiceProviderId, key1) => (
						<div
							className="d-flex w-100"
							key={key1}>
							<div className="d-flex w-100">
								{/* Select Start */}
								<div className="flex-grow-1">
									<select
										name="projectServiceProviderId"
										className="form-control mb-3 me-2"
										onChange={(e) =>
											handleServiceProviderIds(Number.parseInt(e.target.value))
										}
										disabled={projectServiceProviderIds.length > key1 + 1}>
										<option value="">Select Service Provider</option>
										{projectServiceProviders
											.filter(
												(projectServiceProvider) =>
													projectServiceProvider.projectId == projectId
											)
											.map((projectServiceProvider, key2) => (
												<option
													key={key2}
													value={
														!projectServiceProviderIds.some(
															(projectServiceProviderId) =>
																projectServiceProviderId.id ==
																projectServiceProvider.id
														) && projectServiceProvider.id
													}
													className={
														projectServiceProviderIds.some(
															(projectServiceProviderId) =>
																projectServiceProviderId.id ==
																projectServiceProvider.id
														)
															? "text-secondary"
															: "text-primary"
													}
													selected={
														projectServiceProvider.id ==
														projectServiceProviderIds[key1 + 1]?.id
													}>
													{projectServiceProvider.serviceProviderName}
												</option>
											))}
									</select>
								</div>
								{/* Select End */}
								{/* Days Start */}
								<div
									className={`
										${
											key1 == projectServiceProviderIds.length - 1
												? "invisible text-primary"
												: "text-primary"
										}
									 mx-1`}>
									{days.map((day) => (
										<label
											key={day}
											className="text-center mx-1">
											<div>{day.slice(0, 1)}</div>
											<input
												type="checkbox"
												checked={projectServiceProviderIds[key1 + 1]?.days[day]}
												onChange={() => handleCheckboxChange(key1 + 1, day)}
											/>
										</label>
									))}
								</div>
								{/* Days End */}
							</div>
							{/* Close Icon */}
							<span
								className={
									key1 == projectServiceProviderIds.length - 1
										? "invisible text-primary"
										: "text-primary"
								}
								style={{ cursor: "pointer" }}
								onClick={() =>
									setProjectServiceProviderIds(
										projectServiceProviderIds.filter(
											(projectServiceProviderId, index) => index != key1 + 1
										)
									)
								}>
								<CloseSVG />
							</span>
							{/* Close Icon End */}
						</div>
					))}
					{/* Second List End */}
					{/* Service Providers End */}

					<div className="d-flex justify-content-between mb-2">
						<div>
							{/* Starts At */}
							<label htmlFor="">Starts At</label>
							<input
								type="date"
								placeholder="A1"
								defaultValue={wageSheet.startsAtRaw}
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
								defaultValue={wageSheet.endsAtRaw}
								className="form-control mb-2 me-2"
								onChange={(e) => setEndsAt(e.target.value)}
							/>
							{/* Ends At */}
						</div>
					</div>

					{/* Paid By Start */}
					<select
						name="paidBy"
						className="form-control mb-2"
						onChange={(e) => setPaidBy(Number.parseInt(e.target.value))}>
						<option value="">Select Paid By</option>
						{staff.map((staff, key) => (
							<option
								key={key}
								value={staff.id}
								selected={staff.id == wageSheet.paidById}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Paid By End */}

					{/* Approved By Start */}
					<select
						name="projectId"
						className="form-control mb-2"
						onChange={(e) => setApprovedBy(Number.parseInt(e.target.value))}>
						<option value="">Select Approved By</option>
						{staff.map((staff, key) => (
							<option
								key={key}
								value={staff.id}
								selected={staff.id == wageSheet.approvedById}>
								{staff.name}
							</option>
						))}
					</select>
					{/* Approved By End */}

					<div className="d-flex justify-content-end mb-2">
						<Btn
							text="update wage sheet"
							loading={loading}
						/>
					</div>

					<div className="d-flex justify-content-center mb-5">
						<MyLink
							linkTo={`/documents/wage-sheets`}
							icon={<BackSVG />}
							text="back to wage sheets"
						/>
					</div>
					<div className="col-sm-4"></div>
				</form>
			</div>
		</div>
	)
}

export default edit
