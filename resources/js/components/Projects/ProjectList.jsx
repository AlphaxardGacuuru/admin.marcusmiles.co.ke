import React, { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import ProjectSVG from "@/svgs/ProjectSVG"
import DeleteSVG from "@/svgs/DeleteSVG"

const ProjectList = (props) => {
	const location = useLocation()

	const [clients, setClients] = useState([])
	const [tab, setTab] = useState("overview")

	const [loading, setLoading] = useState()

	useEffect(() => {
		// Fetch Clients
		props.get("clients?idAndName=true", setClients)
	}, [])

	/*
	 * Delete Project
	 */
	const onDeleteProject = (projectId) => {
		setLoading(true)
		var projectIds = Array.isArray(projectId) ? projectId.join(",") : projectId

		Axios.delete(`/api/projects/${projectIds}`)
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Fetch Stages
				props.get("stages?type=project", props.setStages)
				// Remove row
				props.setProjects({
					meta: props.projects.meta,
					links: props.projects.links,
					data: props.projects.data.filter(
						(project) => project.id != projectId
					),
				})
				// Clear DeleteIds
				setDeleteIds([])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
				// Clear DeleteIds
				setDeleteIds([])
			})
	}

	const [creatingStage, setCreatingStage] = useState(true)
	const [stageId, setStageId] = useState("")
	const [stageName, setStageName] = useState("")
	const [stagePosition, setStagePosition] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Projects", path: ["projects"] })
	}, [])

	useEffect(() => {
		if (location.pathname.match("/projects")) {
			// Fetch Stages
			props.get(
				`stages?
				type=project&
				name=${props.nameQuery}&
				projectType=${props.typeQuery}&
				location=${props.locationQuery}&
				clientId=${props.clientIdQuery}&
				startMonth=${props.startMonthQuery}&
				endMonth=${props.endMonthQuery}&
				startYear=${props.startYearQuery}&
				endYear=${props.endYearQuery}`,
				props.setStages
			)
		}
	}, [
		props.nameQuery,
		props.typeQuery,
		props.locationQuery,
		props.clientIdQuery,
		props.startMonthQuery,
		props.endMonthQuery,
		props.startYearQuery,
		props.endYearQuery,
	])

	const closeStageModalBtn = useRef()
	const closeProjectModalBtn = useRef()

	const openDeleteStageModalBtn = useRef()
	const closeDeleteStageModalBtn = useRef()

	/*
	 * Create Stage
	 */
	const onCreateStage = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.post(`api/stages`, {
			name: stageName,
			type: "project",
			position: stagePosition,
		})
			.then((res) => {
				setLoading(false)
				// Fetch Stages
				props.get("stages?type=project", props.setStages)
				// Close Stage Create Modal
				closeStageModalBtn.current.click()
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	/*
	 * Update Stage
	 */
	const onUpdateStage = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.put(`api/stages/${stageId}`, {
			name: stageName,
			position: stagePosition,
		})
			.then((res) => {
				setLoading(false)
				// Fetch Stages
				props.get("stages?type=project", props.setStages)
				// Close Stage Create Modal
				closeStageModalBtn.current.click()
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	/*
	 * Delete Stage
	 */
	const onDeleteStage = () => {
		Axios.delete(`api/stages/${stageId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Fetch Stages
				props.get("stages?type=project", props.setStages)
			})
			.catch((err) => props.getErrros(err))
	}

	/*
	 * Update Project
	 */
	const onUpdateProjectStage = (id, stageId) => {
		setLoading(true)

		Axios.put(`api/projects/${id}`, {
			stageId: stageId,
		})
			.then((res) => {
				setLoading(false)
				// Fetch Stages
				props.get("stages?type=project", props.setStages)
				// Close Project Create Modal
				closeProjectModalBtn.current.click()
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list)
		const [removed] = result.splice(startIndex, 1)
		result.splice(endIndex, 0, removed)

		return result
	}

	/**
	 * Moves an item from one list to another list.
	 */
	const move = (source, destination, droppableSource, droppableDestination) => {
		const sourceClone = Array.from(source)
		const destClone = Array.from(destination)
		const [removed] = sourceClone.splice(droppableSource.index, 1)

		destClone.splice(droppableDestination.index, 0, removed)

		const result = {}
		result[droppableSource.droppableId] = sourceClone
		result[droppableDestination.droppableId] = destClone

		return result
	}

	function onDragEnd(result) {
		const { source, destination } = result

		// dropped outside the list
		if (!destination) {
			return
		}
		const soureId = +source.droppableId
		const destinationId = +destination.droppableId

		// Check if project has changed stages
		if (soureId === destinationId) {
			const items = reorder(layout[soureId], source.index, destination.index)
			const newState = [...layout]
			newState[soureId] = items

			setLayout(newState)
		} else {
			const result = move(
				layout[soureId],
				layout[destinationId],
				source,
				destination
			)
			const newState = [...layout]
			newState[soureId] = result[soureId]
			newState[destinationId] = result[destinationId]

			let stageId = props.stages[destinationId].id
			let projectId = result[destinationId][destination.index].id

			onUpdateProjectStage(projectId, stageId)

			setLayout(newState)
		}
	}

	const [layout, setLayout] = useState([])

	useEffect(() => {
		let newLayout = props.stages.map((stage) => stage.projects)
		setLayout(newLayout)
	}, [props.stages])

	const active = (activeTab) => {
		return activeTab == tab
			? "bg-secondary text-white shadow-sm"
			: "bg-secondary-subtle"
	}

	const activeTab = (activeTab) => {
		return activeTab == tab ? "d-block" : "d-none"
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm mb-2 p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between flex-wrap w-100 align-items-center mx-4">
						{/* Total */}
						<HeroHeading
							heading="Total"
							data={props.projects.meta?.total}
						/>
						<HeroIcon>
							<ProjectSVG />
						</HeroIcon>
						{/* Total End */}
					</div>
				</div>
				{/* Total End */}
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			{location.pathname.match("/projects") && (
				<div className="card shadow-sm py-2 px-4">
					<div className="d-flex justify-content-end flex-wrap">
						{/* Name */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Name / Code</label>
							<input
								type="text"
								placeholder="Search by Name or Code"
								className="form-control"
								onChange={(e) => props.setNameQuery(e.target.value)}
							/>
						</div>
						{/* Name End */}
						{/* Type */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Type</label>
							<select
								className="form-control"
								onChange={(e) => props.setTypeQuery(e.target.value)}>
								{[{ id: "", name: "Select Type" }]
									.concat(props.configuration.projectTypes ?? [])
									?.map((type, key) => (
										<option
											key={key}
											value={type.id}
											selected={key == props.type}>
											{type.name}
										</option>
									))}
							</select>
						</div>
						{/* Type End */}
						{/* Location */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Location</label>
							<input
								type="text"
								placeholder="Search by Location"
								className="form-control"
								onChange={(e) => props.setLocationQuery(e.target.value)}
							/>
						</div>
						{/* Location End */}
						{/* Client */}
						<div className="flex-grow-1 me-2 mb-2">
							<label htmlFor="">Client</label>
							<select
								className="form-control"
								onChange={(e) => props.setClientIdQuery(e.target.value)}>
								{[{ id: "", name: "Select Client" }]
									.concat(clients)
									.map((client, key) => (
										<option
											key={key}
											value={client.id}
											selected={key == props.client}>
											{client.name}
										</option>
									))}
							</select>
						</div>
						{/* Client End */}
						{/* Start Date */}
						<div className="d-flex flex-grow-1">
							{/* Start Month */}
							<div className="flex-grow-1 me-2 mb-2">
								<label htmlFor="">Start At</label>
								<select
									className="form-control"
									onChange={(e) =>
										props.setStartMonthQuery(
											e.target.value == "0" ? "" : e.target.value
										)
									}>
									{props.months.map((month, key) => (
										<option
											key={key}
											value={key}
											selected={key == props.startMonth}>
											{month}
										</option>
									))}
								</select>
							</div>
							{/* Start Month End */}
							{/* Start Year */}
							<div className="me-2 mb-2">
								<label
									htmlFor=""
									className="invisible">
									Start At
								</label>
								<select
									className="form-control"
									onChange={(e) => props.setStartYearQuery(e.target.value)}>
									<option value="">Select Year</option>
									{props.years.map((year, key) => (
										<option
											key={key}
											value={year}
											selected={year == props.startYear}>
											{year}
										</option>
									))}
								</select>
							</div>
							{/* Start Year End */}
						</div>
						{/* Start Date End */}
						{/* End Date */}
						<div className="d-flex flex-grow-1">
							{/* End Month */}
							<div className="flex-grow-1 me-2 mb-2">
								<label htmlFor="">End At</label>
								<select
									className="form-control"
									onChange={(e) =>
										props.setEndMonthQuery(
											e.target.value == "0" ? "" : e.target.value
										)
									}>
									{props.months.map((month, key) => (
										<option
											key={key}
											value={key}
											selected={key == props.endMonth}>
											{month}
										</option>
									))}
								</select>
							</div>
							{/* End Month End */}
							{/* End Year */}
							<div className="me-2 mb-2">
								<label
									htmlFor=""
									className="invisible">
									End At
								</label>
								<select
									className="form-control"
									onChange={(e) => props.setEndYearQuery(e.target.value)}>
									<option value="">Select Year</option>
									{props.years.map((year, key) => (
										<option
											key={key}
											value={year}
											selected={year == props.endYear}>
											{year}
										</option>
									))}
								</select>
							</div>
							{/* End Year End */}
						</div>
						{/* End Date End */}
					</div>
				</div>
			)}
			{/* Filters End */}

			<br />

			{/* Tabs */}
			<div
				className={
					location.pathname.match("/projects")
						? "d-flex justify-content-between flex-wrap w-50 mx-auto mb-2"
						: "d-none"
				}>
				<div
					className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
						"overview"
					)}`}
					style={{ cursor: "pointer" }}
					onClick={() => setTab("overview")}>
					Overview
				</div>
				<div
					className={`card shadow-sm flex-grow-1 text-center me-1 mb-2 py-2 px-4 ${active(
						"stages"
					)}`}
					style={{ cursor: "pointer" }}
					onClick={() => setTab("stages")}>
					Stages
				</div>
			</div>
			{/* Tabs End */}

			{/* Table */}
			<div className={`table-responsive mb-5 ${activeTab("overview")}`}>
				<table className="table table-hover">
					<thead>
						{location.pathname.match("/projects") && (
							<tr>
								<th colSpan="8"></th>
								<th className="text-end">
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/erp/projects/create`}
											icon={<PlusSVG />}
											text="create project"
										/>
									</div>
								</th>
							</tr>
						)}
						<tr>
							<th>#</th>
							<th>Location</th>
							<th>Type</th>
							<th>Client</th>
							<th>Name</th>
							{/* <th>Description</th> */}
							<th>Stage</th>
							<th>Created By</th>
							<th>Created At</th>
							<th className="text-center">Action</th>
						</tr>
						{props.projects.data?.map((project, key) => (
							<tr key={key}>
								<td>{project.code}</td>
								<td>{project.location}</td>
								<td className="text-capitalize">{project.type}</td>
								<td>{project.clientName}</td>
								<td>{project.name}</td>
								{/* <td>{project.description}</td> */}
								<td>{project.currentStageName}</td>
								<td>{project.createdBy}</td>
								<td>{project.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/erp/projects/${project.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>

										<MyLink
											linkTo={`/erp/projects/${project.id}/edit`}
											icon={<EditSVG />}
										/>

										<div className="mx-1">
											<DeleteModal
												index={`project${key}`}
												model={project}
												modelName="Project"
												onDelete={onDeleteProject}
											/>
										</div>
									</div>
								</td>
							</tr>
						))}
					</thead>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.projects}
					getPaginated={props.getPaginated}
					setState={props.setProjects}
				/>
				{/* Pagination Links End */}
			</div>
			{/* Table End */}

			{/* Project Stages Start */}
			<div
				className={location.pathname.match("/projects") ? "d-block" : "d-none"}>
				<div className={activeTab("stages")}>
					{/* Stage Modal Start */}
					<div
						className="modal fade"
						id={`createStageModal`}
						tabIndex="-1"
						aria-labelledby="createModalLabel"
						aria-hidden="true">
						<div className="modal-dialog">
							<form
								onSubmit={(e) =>
									creatingStage ? onCreateStage(e) : onUpdateStage(e)
								}>
								<div className="modal-content rounded-4">
									<div className="modal-header">
										<h1
											id="createModalLabel"
											className="modal-title fs-5">
											{creatingStage ? "Create" : "Edit"} Stage
										</h1>
										<button
											type="button"
											className="btn-close"
											data-bs-dismiss="modal"
											aria-label="Close"></button>
									</div>
									<div className="modal-body text-start text-wrap">
										{/* Name Start */}
										<label htmlFor="">Name</label>
										<input
											type="text"
											placeholder="Stage 1"
											className="form-control"
											defaultValue={stageName}
											onChange={(e) => setStageName(e.target.value)}
											required={true}
										/>
										{/* Name End */}
										{/* Position Start */}
										<label htmlFor="">Position</label>
										<input
											type="number"
											placeholder="1"
											defaultValue={stagePosition}
											className="form-control"
											onChange={(e) => setStagePosition(e.target.value)}
											required={true}
										/>
										{/* Position End */}
									</div>
									<div className="modal-footer justify-content-between">
										<button
											ref={closeStageModalBtn}
											type="button"
											className="mysonar-btn btn-2"
											data-bs-dismiss="modal">
											Close
										</button>

										<div className="d-flex">
											{!creatingStage && (
												<div className="mx-1">
													{/* Stage Modal Start */}
													<Btn
														icon={<DeleteSVG />}
														text="delete stage"
														className="me-1"
														onClick={(e) => {
															e.preventDefault()
															// Close Stage Create Modal
															closeStageModalBtn.current.click()
															// Open Stage Delete Modal
															openDeleteStageModalBtn.current.click()
														}}
													/>
													{/* Stage Modal End */}
												</div>
											)}

											<Btn
												text={`${creatingStage ? "create" : "edit"} stage`}
												loading={loading}
											/>
										</div>
									</div>
								</div>
							</form>
						</div>
					</div>
					{/* Stage Modal End */}

					{/* Delete Stage Modal Start */}
					{/* Confirm Delete Modal End */}
					<div
						className="modal fade"
						id={`deleteModalStage`}
						tabIndex="-1"
						aria-labelledby="deleteModalLabel"
						aria-hidden="true">
						<div className="modal-dialog">
							<div className="modal-content rounded-4">
								<div className="modal-header">
									<h1
										id="deleteModalLabel"
										className="modal-title fs-5">
										Delete Stage
									</h1>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Close"></button>
								</div>
								<div className="modal-body text-start text-wrap">
									Are you sure you want to delete the stage {stageName}. All
									associated Project tracking will be lost.
								</div>
								<div className="modal-footer justify-content-between">
									<button
										ref={closeDeleteStageModalBtn}
										type="button"
										className="mysonar-btn btn-2"
										data-bs-dismiss="modal">
										Close
									</button>
									<button
										type="button"
										className="btn btn-danger rounded-4"
										data-bs-dismiss="modal"
										onClick={onDeleteStage}>
										<span className="me-1">{<DeleteSVG />}</span>
										Delete
									</button>
								</div>
							</div>
						</div>
					</div>
					{/* Confirm Delete Modal End */}

					{/* Button trigger modal */}
					<button
						ref={openDeleteStageModalBtn}
						className="d-none"
						data-bs-toggle="modal"
						data-bs-target={`#deleteModalStage`}></button>
					{/* Button trigger modal End */}
					{/* Delete Stage Modal End */}

					{/* Buttons Start */}
					<div className="d-flex m-1">
						{/* Stage Modal Start */}
						<Btn
							icon={<PlusSVG />}
							text="create stage"
							dataBsToggle="modal"
							dataBsTarget={`#createStageModal`}
							className="me-1"
							onClick={() => {
								setCreatingStage(true)
								setStageId("")
								setStageName("")
								setStagePosition("")
							}}
						/>
						{/* Stage Modal End */}
					</div>
					{/* Buttons End */}

					<div className="hidden-scroll">
						<div className="d-flex mt-2">
							<DragDropContext onDragEnd={onDragEnd}>
								{layout.map((stage, stageKey) => (
									<div
										key={stageKey}
										className="d-flex flex-column shadow mb-5 mx-1"
										style={{ border: "2px solid rgba(255, 255, 255, 0.3)" }}>
										{/* Stage Title Start */}
										<h6 className="p-2 text-center">
											{props.stages[stageKey]?.name}

											<div>
												{/* Stage Modal Start */}
												<Btn
													icon={<ViewSVG />}
													text="view"
													dataBsToggle="modal"
													dataBsTarget={`#createStageModal`}
													className="mysonar-sm mt-1 ms-1"
													onClick={() => {
														setCreatingStage(false)
														setStageId(props.stages[stageKey].id)
														setStageName(props.stages[stageKey].name)
														setStagePosition(props.stages[stageKey].position)
													}}
												/>
											</div>
											{/* Stage Modal End */}
										</h6>
										{/* Stage Title End */}
										{/* Stage Start */}
										<Droppable
											key={stageKey}
											droppableId={`${stageKey}`}>
											{(provided, snapshot) => (
												<div
													ref={provided.innerRef}
													className={`${
														snapshot.isDraggingOver ? "bg-warning-subtle" : ""
													}`}
													style={{ width: "250px", minHeight: "200px" }}
													{...provided.droppableProps}>
													{/* Project Start */}
													{stage?.map((project, index) => (
														<Draggable
															key={project.id}
															draggableId={project.id.toString()}
															index={index}>
															{(provided, snapshot) => (
																<div
																	ref={provided.innerRef}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
																	className={`d-flex justify-content-between glass shadow-sm m-2 p-2 ${
																		snapshot.isDragging ? "shadow-lg" : ""
																	}`}>
																	<div>
																		<div className="fw-normal text-primary">
																			{project.code}
																		</div>
																		<div className="text-wrap">
																			{project.name}
																		</div>
																		<div className="text-capitalize">
																			{project.type}
																		</div>
																		{/* <div>
																		<small className="text-primary">
																			ID: {project.id}
																		</small>
																	</div>
																	<div>
																		<small className="text-primary">
																			Stage ID: {project.currentStageId}
																		</small>
																	</div>
																	<div>
																		<small className="text-secondary">
																			New:{" "}
																			{project.new ? (
																				<span className="text-success">
																					True
																				</span>
																			) : (
																				<span className="text-danger">
																					False
																				</span>
																			)}
																		</small>
																	</div> */}
																	</div>
																	<div>
																		<small className="bg-primary-subtle text-muted rounded-pill px-1">
																			{project.clientInitials}
																		</small>
																	</div>
																</div>
															)}
														</Draggable>
													))}
													{/* Project End */}
													{provided.placeholder}
												</div>
											)}
										</Droppable>
										{/* Stage End */}
									</div>
								))}
							</DragDropContext>
						</div>
					</div>
				</div>
			</div>
			{/* Project Stages End */}
		</div>
	)
}

export default ProjectList
