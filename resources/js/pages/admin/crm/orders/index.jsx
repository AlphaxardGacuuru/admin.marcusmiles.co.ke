import React, { useEffect, useState } from "react"

import OrderList from "@/components/Orders/OrderList"

const index = (props) => {
	// Get Order
	const [orders, setOrders] = useState(props.getLocalStorage("orders"))

	const [codeQuery, setCodeQuery] = useState("")
	const [nameQuery, setNameQuery] = useState("")
	const [statusQuery, setStatusQuery] = useState("")
	const [startMonth, setStartMonth] = useState("")
	const [endMonth, setEndMonth] = useState("")
	const [startYear, setStartYear] = useState("")
	const [endYear, setEndYear] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Orders", path: ["crm/orders"] })
	}, [])

	useEffect(() => {
		props.getPaginated(
			`orders?
			code=${codeQuery}&
			name=${nameQuery}&
			status=${statusQuery}&
			startMonth=${startMonth}&
			endMonth=${endMonth}&
			startYear=${startYear}&
			endYear=${endYear}`,
			setOrders,
			"orders"
		)
	}, [codeQuery, nameQuery, statusQuery, startMonth, endMonth, startYear, endYear])

	return (
		<div className="row">
			<div className="col-sm-12">
				{/* Orders Tab */}
				<OrderList
					{...props}
					orders={orders}
					setOrders={setOrders}
					setCodeQuery={setCodeQuery}
					setNameQuery={setNameQuery}
					setStatusQuery={setStatusQuery}
					setStartMonth={setStartMonth}
					setEndMonth={setEndMonth}
					setStartYear={setStartYear}
					setEndYear={setEndYear}
				/>
				{/* Orders Tab End */}
			</div>
		</div>
	)
}

export default index
