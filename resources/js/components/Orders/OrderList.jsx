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
import DeleteModal from "@/components/Core/DeleteModal"
import OrderSVG from "@/svgs/OrderSVG"

const OrderList = (props) => {
	/*
	 * Delete Order
	 */
	const onDeleteOrder = (orderId) => {
		Axios.delete(`/api/orders/${orderId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setOrders({
					meta: props.orders.meta,
					links: props.orders.links,
					data: props.orders.data.filter((item) => item.id != orderId),
				})
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
							heading="Total Orders"
							data={props.orders.data?.length}
						/>
						<HeroIcon>
							<OrderSVG />
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
							<th colSpan="6"></th>
							<th className="text-end">
								<MyLink
									linkTo={`/crm/orders/create`}
									icon={<PlusSVG />}
									text="create order"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Code</th>
							<th>Client Name</th>
							<th>Total (KES)</th>
							<th>Created By</th>
							<th>Status</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.orders.data?.map((order, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.orders)}</td>
								<td>{order.code}</td>
								<td>{order.clientName}</td>
								<td>{order.total}</td>
								<td>{order.createdByName}</td>
								<td>
									<span
										className={`text-capitalize p-2 ${order.status === "pending" ? "bg-warning-subtle" : order.status === "completed" ? "bg-success-subtle" : "bg-danger-subtle"}`}>
										{order.status}
									</span>
								</td>
								<td>
									<div className="d-flex justify-content-center">
										<MyLink
											linkTo={`/crm/orders/${order.id}/view`}
											className="me-1"
											icon={<ViewSVG />}
										/>

										<MyLink
											linkTo={`/crm/orders/${order.id}/edit`}
											icon={<EditSVG />}
											className="btn-sm"
										/>

										<div className="mx-1">
											<DeleteModal
												index={`order${key}`}
												model={order}
												modelName="Order"
												onDelete={onDeleteOrder}
											/>
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.orders}
					getPaginated={props.getPaginated}
					setState={props.setOrders}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default OrderList
