const axios = require('axios');
const Cheerio = require('cheerio');

require('dotenv').config();

const main = async () => {

	// STAGE ONE -- GET LEADS
	const raw_leads = await axios.get(process.env.BASE_URL, {
		headers: {
			Cookie: process.env.LOGGED_IN_COOKIE
		}
	});
	const $ = Cheerio.load(raw_leads['data']);
	let total_leads = [];
	$('.nohover').each((i, element) => {
		const found_lead = $(element).find('a');
		const lead_content = found_lead.find('font').find('font').html().split('<br>');
		const truck_details = lead_content[1].replace('<div style="width:1px;height:3px;"></div><b>Truck Details:</b> ', '').replace(/&#x2022;/g, '').replace(/  /g, " ").replace(/ /g, '/').split("/");
		const cap_options = [];
		cap_options.push(lead_content[3].replace('<div style="width:1px;height:3px;"></div> &#x2022; ', ''));
		for (let i = 4; i < lead_content.length - 6; i++){
			cap_options.push(lead_content[i].replace(' &#x2022; ', ''));
		}
		total_leads.push({
			id: found_lead.attr('href').replace(process.env.FIRST_RESPONSE_URL, ''),
			customer_name: found_lead.find('b').html().split('<br>')[0],
			customer_location: found_lead.find('b').html().split('<br>')[1],
			truck_year: truck_details[0],
			truck_make: truck_details[1],
			truck_model: truck_details.slice(2, truck_details.length - 3).toString().replace(/,/g, ' '),
			truck_length: truck_details[truck_details.length - 2],
			cap_series: lead_content[2].replace("<div style=\"width:1px;height:3px;\"></div><b>Cap Build:</b> ", ''),
			cap_options: cap_options,
			lead_date: lead_content[lead_content.length - 5].replace('<div style="width:1px;height:3px;"></div>\n' +
			'Date Received: ', '')
		});
	});

	console.log(total_leads);

}

main();