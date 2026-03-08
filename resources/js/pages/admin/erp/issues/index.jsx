import React, { useEffect, useRef, useState } from "react"

import Btn from "@/components/Core/Btn"

import SocialMediaInput from "@/components/Core/SocialMediaInput"
import CommentMedia from "@/components/Core/CommentMedia"
import IssueBoard from "@/components/Issues/IssueBoard"

import DeleteSVG from "@/svgs/DeleteSVG"

const index = (props) => {
	const [stages, setStages] = useState([])
	const [issues, setIssues] = useState([])
	const [issueComments, setIssueComments] = useState([])
	const [staff, setStaff] = useState([])
	const [projects, setProjects] = useState([])

	const [creatingStage, setCreatingStage] = useState(true)
	const [stageId, setStageId] = useState("")
	const [stageName, setStageName] = useState("")
	const [stagePosition, setStagePosition] = useState("")

	const [creatingIssue, setCreatingIssue] = useState(true)
	const [issueId, setIssueId] = useState("")
	const [issueTitle, setIssueTitle] = useState()
	const [issueDescription, setIssueDescription] = useState()
	const [issueAssignedTo, setIssueAssignedTo] = useState()
	const [issuePlannedStartDate, setIssuePlannedStartDate] = useState()
	const [issuePlannedEndDate, setIssuePlannedEndDate] = useState()
	const [issuePriority, setIssuePriority] = useState()
	const [issueProjectId, setIssueProjectId] = useState()
	const [issueStageId, setIssueStageId] = useState()
	const [loading, setLoading] = useState()

	const [titleQuery, setTitleQuery] = useState("")
	const [priorityQuery, setPriorityQuery] = useState("")
	const [projectIdQuery, setProjectIdQuery] = useState("")
	const [staffIdQuery, setStaffIdQuery] = useState("")
	const [startMonthQuery, setStartMonthQuery] = useState("")
	const [endMonthQuery, setEndMonthQuery] = useState("")
	const [startYearQuery, setStartYearQuery] = useState("")
	const [endYearQuery, setEndYearQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Issues", path: ["issues"] })
		// Fetch Issues
		props.get("issues", setIssues)
		// Fetch Issues Comments
		props.get("issue-comments", setIssueComments)
		// Fetch Staff
		props.get("staff?idAndName=true", setStaff)
		// Fetch Projects
		props.get("projects", setProjects)
	}, [])

	useEffect(() => {
		// Fetch Stages
		props.get(
			`stages?
			type=issue&
			title=${titleQuery}&
			priority=${priorityQuery}&
			projectId=${projectIdQuery}&
			staffId=${staffIdQuery}&
			startMonth=${startMonthQuery}&
			endMonth=${endMonthQuery}&
			startYear=${startYearQuery}&
			endYear=${endYearQuery}`,
			setStages
		)
	}, [
		titleQuery,
		priorityQuery,
		projectIdQuery,
		staffIdQuery,
		startMonthQuery,
		endMonthQuery,
		startYearQuery,
		endYearQuery,
	])

	const closeStageModalBtn = useRef()
	const closeIssueModalBtn = useRef()

	const openDeleteStageModalBtn = useRef()
	const openDeleteIssueModalBtn = useRef()

	const closeDeleteStageModalBtn = useRef()
	const closeDeleteIssueModalBtn = useRef()

	const issueForm = useRef()

	/*
	 * Create Stage
	 */
	const onCreateStage = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.post(`api/stages`, {
			name: stageName,
			type: "issue",
			position: stagePosition,
		})
			.then((res) => {
				setLoading(false)
				// Fetch Stages
				props.get("stages?type=issue", setStages)
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
				props.get("stages?type=issue", setStages)
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
				props.get("stages?type=issue", setStages)
			})
			.catch((err) => props.getErrros(err))
	}

	/*
	 * Create Issue
	 */
	const onCreateIssue = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.post(`api/issues`, {
			title: issueTitle,
			description: issueDescription,
			assignedTo: issueAssignedTo,
			plannedStartDate: issuePlannedStartDate,
			plannedEndDate: issuePlannedEndDate,
			priority: issuePriority,
			projectId: issueProjectId,
			stageId: issueStageId,
		})
			.then((res) => {
				setLoading(false)
				// Fetch Stages
				props.get("stages?type=issue", setStages)
				// Fetch Issues
				props.get("issues", setIssues)
				// Close Issue Create Modal
				closeIssueModalBtn.current.click()
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	/*
	 * Update Issue
	 */
	const onUpdateIssue = (e) => {
		e.preventDefault()
		setLoading(true)

		Axios.put(`api/issues/${issueId}`, {
			title: issueTitle,
			description: issueDescription,
			assignedTo: issueAssignedTo.toString(),
			plannedStartDate: issuePlannedStartDate,
			plannedEndDate: issuePlannedEndDate,
			priority: issuePriority,
			projectId: issueProjectId.toString(),
			stageId: issueStageId,
		})
			.then((res) => {
				setLoading(false)
				// Fetch Stages
				props.get("stages?type=issue", setStages)
				// Fetch Issues
				props.get("issues", setIssues)
				// Close Issue Create Modal
				closeIssueModalBtn.current.click()
				props.setMessages([res.data.message])
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	/*
	 * Delete Issue
	 */
	const onDeleteIssue = () => {
		Axios.delete(`api/issues/${issueId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Fetch Stages
				props.get("stages?type=issue", setStages)
				// Fetch Issues
				props.get("issues", setIssues)
			})
			.catch((err) => props.getErrros(err))
	}

	/*
	 * Like Comment
	 */
	const onCommentLike = (issueCommentId) => {
		Axios.post(`api/issue-comment-likes`, {
			issueCommentId: issueCommentId.toString(),
		})
			.then((res) => {
				props.setMessages([res.data.message])
				// Fetch Issue Comments
				props.get("issue-comments", setIssueComments)
			})
			.catch((err) => props.getErrros(err))
	}

	/*
	 * Delete Comment
	 */
	const onDeleteComment = (issueCommentId) => {
		Axios.delete(`api/issue-comments/${issueCommentId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove comment
				setIssueComments(
					issueComments.filter((comment) => comment.id != issueCommentId)
				)
				// Fetch Stages
				props.get("stages?type=issue", setStages)
				// Fetch Issue Comments
				props.get("issue-comments", setIssueComments)
			})
			.catch((err) => props.getErrros(err))
	}

	return (
		<div>
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
						<div className="modal-content rounded-4 glass">
							<div className="modal-header">
								<h1
									id="createModalLabel"
									className="modal-title fs-5 text-light">
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

			{/* Issue Modal Start */}
			<div
				className="modal fade"
				id={`createIssueModal`}
				tabIndex="-1"
				aria-labelledby="createModalLabel"
				aria-hidden="true">
				<div className="modal-dialog modal-lg">
					<div className="modal-content rounded-4 glass">
						<div className="modal-header">
							<h1
								id="createModalLabel"
								className="modal-title fs-5 text-light">
								{`${creatingIssue ? "Create" : "Update"} Issue`}
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div className="modal-body text-start text-wrap">
							<form
								ref={issueForm}
								onSubmit={(e) =>
									creatingIssue ? onCreateIssue(e) : onUpdateIssue(e)
								}>
								{/* Title Start */}
								<label htmlFor="">Title</label>
								<input
									type="text"
									placeholder="Issue 1"
									defaultValue={issueTitle}
									className="form-control mb-2"
									onChange={(e) => setIssueTitle(e.target.value)}
									required={true}
								/>
								{/* Title End */}

								{/* Description Start */}
								<label htmlFor="">Description</label>
								<textarea
									type="text"
									rows="5"
									defaultValue={issueDescription}
									className="form-control mb-2"
									onChange={(e) => setIssueDescription(e.target.value)}
									required={true}></textarea>
								{/* Description End */}

								{/* Assigned To Start */}
								<label htmlFor="">Assigned To</label>
								<select
									type="text"
									className="form-control mb-2"
									onChange={(e) => setIssueAssignedTo(e.target.value)}
									required={true}>
									{[
										{
											id: "",
											name: "Select Assignee",
										},
									]
										.concat(staff)
										.map((staff, key) => (
											<option
												key={key}
												value={staff.id}
												selected={issueAssignedTo == staff.id}>
												{staff.name}
											</option>
										))}
								</select>
								{/* Assigned To End */}

								<div className="d-flex justify-content-between">
									{/* Planned Start Date Start */}
									<div>
										<label htmlFor="">Planned Start Date</label>
										<input
											type="date"
											className="form-control me-1 mb-2"
											defaultValue={issuePlannedStartDate}
											onChange={(e) => setIssuePlannedStartDate(e.target.value)}
											required={true}
										/>
									</div>
									{/* Planned Start Date End */}

									{/* Planed End Date Start */}
									<div>
										<label htmlFor="">Planned End Date</label>
										<input
											type="date"
											placeholder="Issue 1"
											className="form-control ms-1 mb-2"
											defaultValue={issuePlannedEndDate}
											onChange={(e) => setIssuePlannedEndDate(e.target.value)}
											required={true}
										/>
									</div>
									{/* Planed End Date End */}
								</div>

								{/* Priority Start */}
								<label htmlFor="">Priority</label>
								<select
									type="text"
									className="form-control text-capitalize mb-2"
									onChange={(e) => setIssuePriority(e.target.value)}
									required={true}>
									{["low", "medium", "high"].map((priority, key) => (
										<option
											key={key}
											value={priority}
											selected={issuePriority == priority}>
											{priority}
										</option>
									))}
								</select>
								{/* Priority End */}

								{/* Project ID Start */}
								<label htmlFor="">Project ID</label>
								<select
									type="text"
									className="form-control mb-2"
									onChange={(e) => setIssueProjectId(e.target.value)}
									required={true}>
									{[
										{
											id: "",
											name: "Select Project",
										},
									]
										.concat(projects)
										.map((project, key) => (
											<option
												key={key}
												value={project.id}
												selected={project.id == issueProjectId}>
												{project.name}
											</option>
										))}
								</select>
								{/* Project ID End */}
							</form>

							{!creatingIssue && (
								<div
									className="accordion rounded-0 my-4"
									id="accordionExample">
									<div className="accordion-item glass rounded-0">
										<h2 className="accordion-header">
											<button
												className="accordion-button collapsed glass rounded-0"
												type="button"
												data-bs-toggle="collapse"
												data-bs-target="#collapseOne"
												aria-expanded="true"
												aria-controls="collapseOne">
												Comments (
												{
													issueComments.filter(
														(issueComment) => issueComment.issueId == issueId
													).length
												}
												)
											</button>
										</h2>
										<div
											id="collapseOne"
											className="accordion-collapse collapse"
											data-bs-parent="#accordionExample">
											<div className="accordion-body">
												{/* SocialMediaInput Start */}
												<SocialMediaInput
													{...props}
													id={issueId}
													placeholder="Add Comment"
													showImage={true}
													showPoll={false}
													urlTo="issue-comments"
													stateToUpdate={() =>
														props.get(`/issue-comments`, setIssueComments)
													}
													editing={false}
												/>
												{/* SocialMediaInput End */}
												<div className="m-2 p-2">
													{issueComments
														.filter(
															(issueComment) => issueComment.issueId == issueId
														)
														.map((issueComment, key) => (
															<CommentMedia
																{...props}
																key={key}
																comment={issueComment}
																onCommentLike={onCommentLike}
																onDeleteComment={onDeleteComment}
															/>
														))}
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>

						<div className="modal-footer justify-content-between">
							<button
								ref={closeIssueModalBtn}
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal">
								Close
							</button>
							<div className="d-flex">
								{!creatingIssue && (
									<div className="mx-1">
										{/* Issue Modal Start */}
										<Btn
											icon={<DeleteSVG />}
											text="delete issue"
											className="me-1"
											onClick={(e) => {
												e.preventDefault()
												// Close Issue Create Modal
												closeIssueModalBtn.current.click()
												// Open Issue Delete Modal
												openDeleteIssueModalBtn.current.click()
											}}
										/>
										{/* Issue Modal End */}
									</div>
								)}

								<Btn
									text={`${creatingIssue ? "create" : "update"} issue`}
									onClick={(e) => {
										e.preventDefault()
										issueForm.current.requestSubmit()
									}}
									loading={loading}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Issue Modal End */}

			{/* Delete Stage Modal Start */}
			{/* Confirm Delete Modal End */}
			<div
				className="modal fade"
				id={`deleteModalStage`}
				tabIndex="-1"
				aria-labelledby="deleteModalLabel"
				aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content rounded-4 glass">
						<div className="modal-header">
							<h1
								id="deleteModalLabel"
								className="modal-title fs-5 text-light">
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
							associated Issue tracking will be lost.
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

			{/* Trigger Modal Button Start */}
			<button
				ref={openDeleteStageModalBtn}
				className="d-none"
				data-bs-toggle="modal"
				data-bs-target={`#deleteModalStage`}>
				Delete Stage
			</button>
			{/* Trigger Modal Button End */}
			{/* Delete Stage Modal End */}

			{/* Delete Issue Modal Start */}
			{/* Confirm Delete Modal End */}
			<div
				className="modal fade"
				id={`deleteModalIssue`}
				tabIndex="-1"
				aria-labelledby="deleteModalLabel"
				aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content rounded-4">
						<div className="modal-header">
							<h1
								id="deleteModalLabel"
								className="modal-title fs-5 text-light">
								Delete Issue
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div className="modal-body text-start text-wrap">
							Are you sure you want to delete the issue {issueTitle}. All
							associated Issue tracking will be lost.
						</div>
						<div className="modal-footer justify-content-between">
							<button
								ref={closeDeleteIssueModalBtn}
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal">
								Close
							</button>
							<button
								type="button"
								className="btn btn-danger rounded-4"
								data-bs-dismiss="modal"
								onClick={onDeleteIssue}>
								<span className="me-1">{<DeleteSVG />}</span>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Confirm Delete Modal End */}

			{/* Trigger Modal Button Start */}
			<button
				ref={openDeleteIssueModalBtn}
				className="d-none"
				data-bs-toggle="modal"
				data-bs-target={`#deleteModalIssue`}>
				Delete Issue
			</button>
			{/* Trigger Modal Button End */}
			{/* Delete Issue Modal End */}

			{/* Issue Board Start */}
			<IssueBoard
				{...props}
				stages={stages}
				setStages={setStages}
				issues={issues}
				setIssues={setIssues}
				projects={projects}
				staff={staff}
				setCreatingStage={setCreatingStage}
				setStageId={setStageId}
				setStageName={setStageName}
				setStagePosition={setStagePosition}
				setCreatingIssue={setCreatingIssue}
				setIssueId={setIssueId}
				setIssueTitle={setIssueTitle}
				setIssueDescription={setIssueDescription}
				setIssueAssignedTo={setIssueAssignedTo}
				setIssuePlannedStartDate={setIssuePlannedStartDate}
				setIssuePlannedEndDate={setIssuePlannedEndDate}
				setIssuePriority={setIssuePriority}
				setIssueProjectId={setIssueProjectId}
				setIssueStageId={setIssueStageId}
				setTitleQuery={setTitleQuery}
				setPriorityQuery={setPriorityQuery}
				setProjectIdQuery={setProjectIdQuery}
				setStaffIdQuery={setStaffIdQuery}
				setStartMonthQuery={setStartMonthQuery}
				setEndMonthQuery={setEndMonthQuery}
				setStartYearQuery={setStartYearQuery}
				setEndYearQuery={setEndYearQuery}
			/>
			{/* Issue Board End */}
		</div>
	)
}

export default index
