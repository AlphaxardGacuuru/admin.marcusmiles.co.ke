import React, { useState } from "react"

import MyLink from "@/components/Core/MyLink"
import Img from "@/components/Core/Img"
import Btn from "@/components/Core/Btn"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import PersonSVG from "@/svgs/PersonSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import DeleteSVG from "@/svgs/DeleteSVG"
import ShareSVG from "@/svgs/ShareSVG"
import InviteSVG from "@/svgs/InviteSVG"

const ClientList = (props) => {
	/*
	 * Delete Client
	 */
	const onDeleteClient = (client) => {
		Axios.delete(`/api/clients/${client.id}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setClients({
					meta: props.clients.meta,
					links: props.clients.links,
					data: props.clients.data.filter((item) => item.id != client.id),
				})
			})
			.catch((err) => props.getErrors(err))
	}

	// Web Share API for share button
	// Share must be triggered by "user activation"
	const onShare = () => {
		// Define share data
		const shareData = {
			title: "Invite Client",
			text: `Log in to Marcus Miles\n`,
			url: `https://admin.marcusmiles.co.ke/#/clients/register`,
		}
		// Check if data is shareble
		navigator.canShare(shareData) && navigator.share(shareData)
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between w-100 align-items-center mx-4">
						<HeroHeading
							heading="Total Clients"
							data={props.clients.data?.length}
						/>
						<HeroIcon>
							<PersonSVG />
						</HeroIcon>
					</div>
					{/* Total End */}
				</div>
			</div>
			{/* Data End */}

			<br />

			{/* Filters */}
			<div className="card shadow-sm p-4">
				<div className="d-flex flex-wrap">
					{/* Name */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							id=""
							type="text"
							name="name"
							placeholder="Search by Name"
							className="form-control"
							onChange={(e) => props.setNameQuery(e.target.value)}
						/>
					</div>
					{/* Name End */}
				</div>
			</div>
			{/* Filters End */}

			<br />

			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th colSpan="5"></th>
							<th className="text-end">
								<Btn
									icon={<InviteSVG />}
									text="invite client"
									onClick={onShare}
								/>
							</th>
							<th className="text-end">
								<MyLink
									linkTo={`/erp/clients/create`}
									icon={<PlusSVG />}
									text="add client"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th></th>
							<th>Name</th>
							<th>Email</th>
							<th>Phone</th>
							<th>Location</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.clients.data?.map((client, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.clients)}</td>
								<td>
									<Img
										src={client.avatar}
										className="rounded-circle"
										width="25px"
										height="25px"
										alt="Avatar"
									/>
								</td>
								<td>{client.name}</td>
								<td>{client.email}</td>
								<td>{client.phone}</td>
								<td>{client.location}</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/erp/clients/${client.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>

										<MyLink
											linkTo={`/erp/clients/${client.id}/edit`}
											icon={<EditSVG />}
											className="btn-sm"
										/>

										<div className="mx-1">
											{/* Confirm Delete Modal End */}
											<div
												className="modal fade"
												id={`deleteModalClient${client.id}`}
												tabIndex="-1"
												aria-labelledby="deleteModalLabel"
												aria-hidden="true">
												<div className="modal-dialog">
													<div className="modal-content rounded-4">
														<div className="modal-header">
															<h1
																id="deleteModalLabel"
																className="modal-title fs-5">
																Delete {client.name}
															</h1>
															<button
																type="button"
																className="btn-close"
																data-bs-dismiss="modal"
																aria-label="Close"></button>
														</div>
														<div className="modal-body text-start text-wrap">
															Are you sure you want to delete {client.name}.
														</div>
														<div className="modal-footer justify-content-between">
															<button
																type="button"
																className="mysonar-btn btn-2"
																data-bs-dismiss="modal">
																Close
															</button>
															<button
																type="button"
																className="btn btn-danger rounded-4"
																data-bs-dismiss="modal"
																onClick={() => onDeleteClient(client)}>
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
												type="button"
												className="mysonar-btn btn-2"
												data-bs-toggle="modal"
												data-bs-target={`#deleteModalClient${client.id}`}>
												<DeleteSVG />
											</button>
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.clients}
					getPaginated={props.getPaginated}
					setState={props.setClients}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default ClientList
