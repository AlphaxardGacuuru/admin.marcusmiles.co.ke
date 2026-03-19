import React, { useEffect, useState } from "react"

import GoodList from "@/components/Goods/GoodList"

const index = (props) => {
	const [goods, setGoods] = useState(props.getLocalStorage("goods"))

	const [codeQuery, setCodeQuery] = useState("")
	const [nameQuery, setNameQuery] = useState("")
	const [createdByQuery, setCreatedByQuery] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Goods", path: ["erp/goods"] })
	}, [])

	useEffect(() => {
		// Fetch Goods
		props.getPaginated(
			`goods?
			code=${codeQuery}&
			name=${nameQuery}&
			createdBy=${createdByQuery}`,
			setGoods,
			"goods"
		)
	}, [codeQuery, nameQuery, createdByQuery])

	return (
		<GoodList
			{...props}
			goods={goods}
			setGoods={setGoods}
			setCodeQuery={setCodeQuery}
			setNameQuery={setNameQuery}
			setCreatedByQuery={setCreatedByQuery}
		/>
	)
}

export default index
