import React, { useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import GoodSVG from "@/svgs/GoodSVG"
import ViewSVG from "@/svgs/ViewSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"

const GoodList = (props) => {
	/*
	 * Delete Good
	 */
	const onDeleteGood = (goodId) => {
		Axios.delete(`/api/goods/${goodId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setGoods({
					meta: props.goods.meta,
					links: props.goods.links,
					data: props.goods.data.filter((good) => good.id != goodId),
				})
				// Update Good
				props.get(`goods`, props.setGoods)
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
							heading="Total Goods"
							data={props.goods.data?.length}
						/>
						<HeroIcon>
							<GoodSVG />
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
							placeholder="Search by Name or Item No"
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
									linkTo={`/erp/goods/create`}
									icon={<PlusSVG />}
									text="add good"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Code</th>
							<th>Name</th>
							<th>Mark Up (%)</th>
							<th>Notification Quantity</th>
							<th>Created By</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.goods.data?.map((good, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.goods)}</td>
								<td>{good.code}</td>
								<td>{good.name}</td>
								<td>{good.markup}</td>
								<td>{good.notificationQuantity}</td>
								<td>{good.createdBy}</td>
								<td>
									<div className="d-flex justify-content-center">
										<React.Fragment>
											<MyLink
												linkTo={`/erp/goods/${good.id}/edit`}
												icon={<EditSVG />}
												className="btn-sm"
											/>

											<div className="mx-1">
												<DeleteModal
													index={`good${key}`}
													model={good}
													modelName="Good"
													onDelete={onDeleteGood}
												/>
											</div>
										</React.Fragment>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.goods}
					getPaginated={props.getPaginated}
					setState={props.setGoods}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default GoodList
