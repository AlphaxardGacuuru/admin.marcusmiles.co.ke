import React, { useRef, useState } from "react"
import {
	useHistory,
	useLocation,
} from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import InventorySVG from "@/svgs/InventorySVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"
import ArrowDownSVG from "@/svgs/ArrowDownSVG"

const InventoryList = (props) => {
	const location = useLocation()
	const history = useHistory()

	const [inventoryIds, setInventoryIds] = useState([])
	const [loading, setLoading] = useState()

	const closeConsumeInventoryModalBtn = useRef()

	/*
	 * Reduce Quantity
	 */
	const reduceQuantity = (inventoryId, quantity) => {
		setLoading(true)

		let reducedQuantity = quantity - 1

		Axios.put(`/api/inventories/${inventoryId}`, {
			reduce: true,
			quantity: reducedQuantity.toString(),
		})
			.then((res) => {
				setLoading(false)
				// Show messages
				props.setMessages([res.data.message])
				// Fetch Inventory
				props.getPaginated(
					`inventories?projectId=${props.projectId}`,
					props.setInventories
				)
				// Close Modal
				closeConsumeInventoryModalBtn.current.click()
			})
			.catch((err) => {
				setLoading(false)
				// Get Errors
				props.getErrors(err)
			})
	}

	/*
	 * Handle InventoryId checkboxes
	 */
	const handleSetInventoryIds = (inventoryId) => {
		var exists = inventoryIds.includes(inventoryId)

		var newInventoryIds = exists
			? inventoryIds.filter((item) => item != inventoryId)
			: [...inventoryIds, inventoryId]

		setInventoryIds(newInventoryIds)
	}

	/*
	 * Handle Create Delivery Notes
	 */
	const createDeliveryNotes = () => {
		setLoading(true)

		Axios.post("api/delivery-notes", {
			inventoryIds: inventoryIds,
		})
			.then((res) => {
				setLoading(false)
				props.setMessages([res.data.message])
				// Clear Checkboxes
				setInventoryIds([])
				// Redirect to Delivery Notes
				setTimeout(
					() =>
						history.push(
							`/admin/documents/delivery-notes/${res.data.data.id}/edit`
						),
					500
				)
			})
			.catch((err) => {
				setLoading(false)
				props.getErrors(err)
			})
	}

	/*
	 * Delete Inventory
	 */
	const onDeleteInventory = (inventoryId) => {
		Axios.delete(`/api/inventories/${inventoryId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setInventories({
					meta: props.inventories.meta,
					links: props.inventories.links,
					data: props.inventories.data.filter(
						(inventory) => inventory.id != inventoryId
					),
				})
				// Update Project
				props.get(`projects/${props.projectId}`, props.setProject)
			})
			.catch((err) => props.getErrors(err))
	}

	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between w-100 align-items-center mx-4">
						<HeroHeading
							heading="Total Inventory"
							data={props.inventories.data?.length}
						/>
						<HeroIcon>
							<InventorySVG />
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
						{location.pathname.match("/view") && (
							<tr>
								<th colSpan="5"></th>
								<th
									colSpan="3"
									className="text-end">
									{inventoryIds.length > 0 && (<Btn
										icon={<PlusSVG />}
										text="generate delivery note"
										onClick={createDeliveryNotes}
										loading={loading}
									/>)}
								</th>
								<th className="text-end">
									<MyLink
										linkTo={`/erp/inventory/${props.projectId}/create`}
										icon={<PlusSVG />}
										text="add inventory"
									/>
								</th>
							</tr>
						)}
						<tr>
							<th>
								<input
									type="checkbox"
									checked={
										inventoryIds.length == props.inventories.data?.length &&
										inventoryIds.length != 0
									}
									onClick={() =>
										setInventoryIds(
											inventoryIds.length == props.inventories.data.length
												? []
												: props.inventories.data.map(
														(inventory) => inventory.id
												  )
										)
									}
								/>
							</th>
							<th>#</th>
							<th>Name</th>
							<th>Unit</th>
							<th>Quantity</th>
							<th>Project</th>
							<th>Supplier</th>
							<th>Added On</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.inventories.data?.map((inventory, key) => (
							<tr key={key}>
								<td>
									<input
										type="checkbox"
										checked={
											inventoryIds.includes(inventory.id) ||
											inventory.inDeliveryNote
										}
										onClick={() => handleSetInventoryIds(inventory.id)}
										disabled={inventory.inDeliveryNote}
									/>
								</td>
								<td>{props.iterator(key, props.inventories)}</td>
								<td>{inventory.goodName}</td>
								<td>{inventory.unit.value} {inventory.unit.unit}</td>
								<td>{inventory.quantity}</td>
								<td>{inventory.projectName}</td>
								<td>{inventory.supplierName}</td>
								<td>{inventory.createdAt}</td>
								<td>
									{location.pathname.match("/view") && (
										<div className="d-flex justify-content-center">
											<React.Fragment>
												<MyLink
													linkTo={`/erp/inventory/${inventory.id}/edit`}
													icon={<EditSVG />}
													className="btn-sm me-1"
												/>

												{/* Consume Inventory Modal Start */}
												{/* Consume Inventory Modal End */}
												<div
													className="modal fade"
													id={`consumeModalStage`}
													tabIndex="-1"
													aria-labelledby="consumeModalLabel"
													aria-hidden="true">
													<div className="modal-dialog">
														<div className="modal-content rounded-4 glass">
															<div className="modal-header">
																<h1
																	id="consumeModalLabel"
																	className="modal-title fs-5 text-light">
																	Consume Item
																</h1>
																<button
																	type="button"
																	className="btn-close"
																	data-bs-dismiss="modal"
																	aria-label="Close"></button>
															</div>
															<div className="modal-body text-start text-wrap">
																Are you sure you want to consume{" "}
																{inventory.goodName}.
															</div>
															<div className="modal-footer justify-content-between">
																<button
																	ref={closeConsumeInventoryModalBtn}
																	type="button"
																	className="mysonar-btn btn-2"
																	data-bs-dismiss="modal">
																	Close
																</button>

																<Btn
																	icon={<ArrowDownSVG />}
																	text="Consume"
																	onClick={() =>
																		reduceQuantity(
																			inventory.id,
																			inventory.quantity
																		)
																	}
																/>
															</div>
														</div>
													</div>
												</div>
												{/* Consume Inventory Modal End */}

												<Btn
													icon={<ArrowDownSVG />}
													dataBsToggle="modal"
													dataBsTarget={`#consumeModalStage`}
													tooltipText="Consume Item"
												/>
												{/* Consume Inventory Modal End */}

												<div className="mx-1">
													<DeleteModal
														index={`inventory${key}`}
														model={inventory}
														modelName="Inventory"
														onDelete={onDeleteInventory}
													/>
												</div>
											</React.Fragment>
										</div>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.inventories}
					getPaginated={props.getPaginated}
					setState={props.setInventories}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default InventoryList
