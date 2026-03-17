import React, { useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"

import MyLink from "@/components/Core/MyLink"
import Btn from "@/components/Core/Btn"
import Img from "@/components/Core/Img"
import DeleteModal from "@/components/Core/DeleteModal"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import ProductSVG from "@/svgs/ProductSVG"
import EditSVG from "@/svgs/EditSVG"
import PlusSVG from "@/svgs/PlusSVG"

const ProductList = (props) => {
	/*
	 * Delete Product
	 */
	const onDeleteProduct = (productId) => {
		Axios.delete(`/api/products/${productId}`)
			.then((res) => {
				props.setMessages([res.data.message])
				// Remove row
				props.setProducts({
					meta: props.products.meta,
					links: props.products.links,
					data: props.products.data.filter((product) => product.id != productId),
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
							heading="Total Products"
							data={props.products.data?.length}
						/>
						<HeroIcon>
							<ProductSVG />
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
					{/* Code */}
					<div className="flex-grow-1 me-2 mb-2">
						<input
							id=""
							type="text"
							name="code"
							placeholder="Search by Code"
							className="form-control"
							onChange={(e) => props.setCodeQuery(e.target.value)}
						/>
					</div>
					{/* Code End */}
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
									linkTo={`/crm/products/create`}
									icon={<PlusSVG />}
									text="add product"
								/>
							</th>
						</tr>
						<tr>
							<th>#</th>
							<th>Code</th>
							<th>Name</th>
							<th>Price (KES)</th>
							<th>Created By</th>
							<th>Created At</th>
							<th className="text-center">Action</th>
						</tr>
					</thead>
					<tbody>
						{props.products.data?.map((product, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.products)}</td>
								<td>{product.code}</td>
								<td>{product.name}</td>
								<td>{product.price}</td>
								<td>{product.createdByName}</td>
								<td>{product.createdAt}</td>
								<td>
									<div className="d-flex justify-content-center">
										<React.Fragment>
											<MyLink
												linkTo={`/crm/products/${product.id}/edit`}
												icon={<EditSVG />}
												className="btn-sm"
											/>

											<div className="mx-1">
												<DeleteModal
													index={`product${key}`}
													model={product}
													modelName="Product"
													onDelete={onDeleteProduct}
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
					list={props.products}
					getPaginated={props.getPaginated}
					setState={props.setProducts}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default ProductList