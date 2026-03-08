import React, { useState } from "react"

import PaginationLinks from "@/components/Core/PaginationLinks"

import HeroHeading from "@/components/Core/HeroHeading"
import HeroIcon from "@/components/Core/HeroIcon"

import MoneySVG from "@/svgs/MoneySVG"
import PaymentSVG from "@/svgs/PaymentSVG"
import BalanceSVG from "@/svgs/BalanceSVG"

const StatementList = (props) => {
	return (
		<div className={props.activeTab}>
			{/* Data */}
			<div className="card shadow-sm p-2">
				<div className="d-flex justify-content-between">
					{/* Total */}
					<div className="d-flex justify-content-between w-100 align-items-center mx-4">
						{/* Due */}
						<HeroHeading
							heading="Due"
							data={
								<span>
									<small>KES</small> {props.statements.due}
								</span>
							}
						/>
						<HeroIcon>
							<MoneySVG />
						</HeroIcon>
						{/* Due End */}
						{/* Paid */}
						<HeroHeading
							heading="Paid"
							data={
								<span>
									<small>KES</small> {props.statements.paid}
								</span>
							}
						/>
						<HeroIcon>
							<PaymentSVG />
						</HeroIcon>
						{/* Paid End */}
						{/* Balance */}
						<HeroHeading
							heading="Balance"
							data={
								<span>
									<small>KES</small> {props.statements.balance}
								</span>
							}
						/>
						<HeroIcon>
							<BalanceSVG />
						</HeroIcon>
						{/* Balance End */}
					</div>
					{/* Total End */}
				</div>
			</div>
			{/* Data End */}

			<br />

			<div className="table-responsive mb-5">
				<table className="table table-hover">
					<thead>
						<tr>
							<th>#</th>
							<th>Tenant</th>
							<th>Type</th>
							<th>Month</th>
							<th>Year</th>
							<th>Money In</th>
							<th>Money Out</th>
							<th>Balance</th>
						</tr>
					</thead>
					<tbody>
						{props.statements.data?.map((statement, key) => (
							<tr key={key}>
								<td>{props.iterator(key, props.statements)}</td>
								<td>{statement.tenantName}</td>
								<td className="text-capitalize">{statement.type}</td>
								<td className="text-capitalize">
									{props.months[statement.month]}
								</td>
								<td>{statement.year}</td>
								<td className="text-success">
									<small>KES</small> {statement.credit}
								</td>
								<td className="text-success">
									<small>KES</small> {statement.debit}
								</td>
								<td className="text-success">
									<small>KES</small> {statement.balance}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{/* Pagination Links */}
				<PaginationLinks
					list={props.statements}
					getPaginated={props.getPaginated}
					setState={props.setStatements}
				/>
				{/* Pagination Links End */}
			</div>
		</div>
	)
}

export default StatementList
