let window = {}
function addEventListener() {}

window.Categories = [
	{
		name: "Cable",
		path: [],
		products: 7522,
	},
	{
		name: "Connectors",
		path: [],
		products: 2461,
	},
	{
		name: "CPR Euroclass",
		path: [],
		products: 2000,
	},
	{
		name: "I/O Systems",
		path: [],
		products: 195,
	},
	{
		name: "Industrial Networking & Cybersecurity",
		path: [],
		products: 578,
	},
	{
		name: "Panels & Patching Systems",
		path: [],
		products: 231,
	},
	{
		name: "Patch Cords, Cordsets & Assemblies",
		path: [],
		products: 837,
	},
	{
		name: "Racks, Cabinets & Cable Management",
		path: [],
		products: 81,
	},
	{
		name: "Enclosures",
		path: ["Racks, Cabinets & Cable Management"],
		products: 5,
	},
	{
		name: "Rack & Cabinet Accessories",
		path: ["Racks, Cabinets & Cable Management"],
		products: 13,
	},
	{
		name: "Racks & Cabinets",
		path: ["Racks, Cabinets & Cable Management"],
		products: 68,
	},
	{
		name: ,
		path: ["Racks, Cabinets & Cable Management", "Racks & Cabinets"],
		products: ,
	},
	{
		name: ,
		path: ["Racks, Cabinets & Cable Management", "Racks & Cabinets"],
		products: ,
	},
	{
		name: ,
		path: ["Racks, Cabinets & Cable Management", "Racks & Cabinets"],
		products: ,
	},
	{
		name: ,
		path: ["Racks, Cabinets & Cable Management", "Racks & Cabinets"],
		products: ,
	},
	{
		name: "Tools & Accessories",
		path: [],
		products: 191,
	},
	{
		name: "Copper Products Tools & Accessories",
		path: ["Tools & Accessories"],
		products: 13,
	},
	{
		name: "Network Accessories",
		path: ["Tools & Accessories"],
		products: 125,
	},
	{
		name: "Termination Tools & Accessories",
		path: ["Tools & Accessories"],
		products: 53,
	},
	{
		name: "Wireless Accessories",
		path: ["Tools & Accessories"],
		products: 1,
	},
]

addEventListener("DOMContentLoaded", (event) => {
	for (let link of document.querySelectorAll('a.navPages-action')) { if (window.Categories.map(({ name }) => name).includes(link.textContent.trim())) { link.innerHTML = `${link.textContent} <span class="product-count">(${window.Categories.find(({ name }) => name === link.textContent.trim()).products})</span>` } }
})
