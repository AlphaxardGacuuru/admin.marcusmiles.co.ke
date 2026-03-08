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
import HistorySVG from "@/svgs/HistorySVG"

const SupplierGoodsList = (props) => {
	const [supplierGoodPrices, setSupplierGoodPrices] = useState([])

	/*
	 * Delete SupplierGood
	 */
	const onDeleteGood = (supplierGoodId) => {
		Axios.delete(`/api/supplierGoods/${supplierGoodId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setSupplierGoods({
					meta: props.supplierGoods.meta,
					links: props.supplierGoods.links,
					data: props.supplierGoods.data.filter(
						(supplierGood) => supplierGood.id != supplierGoodId
					),
				})
				// Update SupplierGood
				props.get(`supplierGoods`, props.setSupplierGoods)
			})
			.catch((err) => props.getErrors(err))
	}

	return (
		<div className={props.activeTab}>
			{/* Confirm Delete Modal End */}
			<div
				className="modal fade"
				id={`priceHistoryModal`}
				tabIndex="-1"
				aria-labelledby="priceHistoryModalLabel"
				aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content rounded-4">
						<div className="modal-header">
							<h1
								id="priceHistoryModalLabel"
								className="modal-title fs-5">
								{supplierGoodPrices[0]?.supplierName}'s' Price History for{" "}
								{supplierGoodPrices[0]?.goodName}
							</h1>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"></button>
						</div>
						<div className="modal-body text-start text-wrap">
							<table className="table table-hover">
								<thead>
									<tr>
										<th>#</th>
										<th>Price</th>
										<th>Updated By</th>
										<th>Updated At</th>
									</tr>
								</thead>
								<tbody>
									{supplierGoodPrices.map((supplierGoodPrice, key) => (
										<tr key={key}>
											<td>{key + 1}</td>
											<td>{supplierGoodPrice.price}</td>
											<td>{supplierGoodPrice.createdByName}</td>
											<td>{supplierGoodPrice.createdAt}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="modal-footer justify-content-center">
							<button
								type="button"
								className="mysonar-btn btn-2"
								data-bs-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Confirm Delete Modal End */}

			{/* Data */}
			<div className="card shadow-sm p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between w-100 align-items-center mx-4">
						<HeroHeading
							heading="Total Goods"
							data={props.supplierGoods.data?.length}
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
									linkTo={`/erp/supplier-goods/${props.supplierId}/create`}
									icon={<PlusSVG />}
									text="add supplier good"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Code</th>
							<th>Name</th>
							<th>Buying Price (KES)</th>
							<th>Selling Price (KES)</th>
							<th>Created By</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.supplierGoods.data?.map((supplierGood, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.supplierGoods)}</td>
								<td>{supplierGood.goodCode}</td>
								<td>{supplierGood.goodName}</td>
								<td>{supplierGood.currentPrice}</td>
								<td>{supplierGood.sellingPrice}</td>
								<td>{supplierGood.createdByName}</td>
								<td>
									<div className="d-flex justify-content-center">
										{/* Button trigger modal */}
										<Btn
											icon={<HistorySVG />}
											className="me-1"
											dataBsToggle="modal"
											dataBsTarget={`#priceHistoryModal`}
											onClick={() => setSupplierGoodPrices(supplierGood.prices)}
										/>
										{/* Button trigger modal End */}

										<MyLink
											linkTo={`/erp/supplier-goods/${supplierGood.id}/edit`}
											icon={<EditSVG />}
											className="btn-sm"
										/>

										<div className="mx-1">
											<DeleteModal
												index={`supplierGood${key}`}
												model={supplierGood}
												modelName="SupplierGood"
												onDelete={onDeleteGood}
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
					list={props.supplierGoods}
					getPaginated={props.getPaginated}
					setState={props.setSupplierGoods}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default SupplierGoodsList
