import React, { useEffect, useState } from "react"

import GoodList from "@/components/Goods/GoodList"

const index = (props) => {
	const [goods, setGoods] = useState([])

	const [name, setName] = useState("")

	useEffect(() => {
		// Set page
		props.setPage({ name: "Goods", path: ["goods"] })
	}, [])

	useEffect(() => {
		// Fetch Goods
		props.getPaginated(`goods?name=${name}`, setGoods)
	}, [name])

	return (
		<GoodList
			{...props}
			goods={goods}
			setGoods={setGoods}
			setName={setName}
		/>
	)
}

export default index
