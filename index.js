const Cheerio = require('cheerio');
const axios = require('axios');
const FormData = require('form-data');

require('dotenv').config();

const main = async () => {

	// STAGE ONE -- GET LEADS
	const raw_lead_results = await axios.get(process.env.BASE_URL, {
		headers: {
			Cookie: process.env.LOGGED_IN_COOKIE
		}
	});
	const parsed_lead_results = Cheerio.load(raw_lead_results['data']);
	let total_leads = [];
	parsed_lead_results('.nohover').each((i, element) => {
		const found_lead = parsed_lead_results(element).find('a');
		const lead_content = found_lead.find('font').find('font').html().split('<br>');
		const truck_details = lead_content[1].replace('<div style="width:1px;height:3px;"></div><b>Truck Details:</b> ', '').replace(/&#x2022;/g, '').replace(/  /g, " ").replace(/ /g, '/').split("/");
		const cap_options = [];
		cap_options.push(lead_content[3].replace('<div style="width:1px;height:3px;"></div> &#x2022; ', ''));
		for (let i = 4; i < lead_content.length - 6; i++){
			cap_options.push(lead_content[i].replace(' &#x2022; ', ''));
		}
		total_leads.push({
			id: found_lead.attr('href').replace(`first_response.php?WC=${process.env.LOCATION_NAME}&Ps=${process.env.PASSWORD}&Key=&DLogin=t&RID=`, ''),
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

	let url_object = {
		WC: process.env.LOCATION_NAME,
		Ps: process.env.PASSWORD,
		DCode: process.env.LOCATION_NAME,
		CODE: process.env.LOCATION_NAME,
		RID: total_leads[0].id,
		CusName: total_leads[0].customer_name,
		COpText01_ver: `Re+A.R.E.+Information+Request:+For+-+${total_leads[0].truck_make},+${total_leads[0].truck_model},+${total_leads[0].truck_year},+${total_leads[0].truck_length}+in.,+${total_leads[0].cap_series},+${total_leads[0].cap_options.toString().replace(/,/g, ',+').replace(/ /g, '+')}`,
		Build_Details: `${total_leads[0].cap_series},+${total_leads[0].cap_options.toString().replace(/,/g, ',+').replace(/ /g, '+')}`,
		Key: ``,
		DLogin: `t`,
		RTemp: `fr001`,
		Method: `1`,
		DelEmail: `maverickstta@yahoo.com`,
		MapURL: `http://maps.google.com/maps?f=q&hl=en&geocode=&q=200+Higuera++San+Luis+Obispo+CA+93401`,
		RTText01: `Hello`,
		RTText02: `My+name+is`,
		RTText03: `from`,
		RTText04: `and+I+received+your+inquiry+regarding+A.R.E.++Thanks+for+your+interest+in+our+premier+line+of+caps+and+tonneau+covers!`,
		RTText05: ``,
		RTText06: ``,
		RTText15: `Please+email,+stop+in,+or+call+us+with+any+questions+you+might+have.+We+will+be+glad+to+help!`,
		Plan_For: ``,
		Budget: ``,
		Timeline: ``,
		Comments: ``,
		How_Many_Trucks: ``,
		Plan_Next_Year: ``,
		Planning_Current: ``,
		Multi_Locations: ``,
		FMSubject: `Re:+A.R.E.+Information+Request`,
		DelContact: `Geoff`,
		DelName: `Mavericks+Truck+Tops+&+Accessories`,
		Customer_Question: ``,
		COpText_01: `<span+style="font-family:+verdana,+tahoma,+arial;+font-size:+small;"><span+style="font-family:+verdana,+tahoma,+arial;+font-size:+small;">V:+$1800<br+/>+Interior+Carpet:+Dark+Gray+Headliner<br+/>+Front+Window:+Aluminum+Framed+Tilt-Down+Sliding+Window<br+/>+Side+Window:+Outdoorsman+Vented+Windoor<br+/>+Rear+Door:+Aluminum+Framed+Single+T+Door</span></span>`,
		COpText_02: `You+are+making+a+smart+choice+in+considering+the+A.R.E.+Brand.+A.R.E.+has+been+in+business+for+over+forty+years,+and+my+personal+experience+with+their+product+has+been+excellent.+Their+caps+and+covers+are+custom+designed+by+truck+model,+and+are+painted+to+match+vehicle+paint+codes.+They+are+well+built,+and+they+look+great.`,
		COpText_03: `Our+store+is+your+local+truck+accessory+expert.+We+have+installed+and+serviced+A.R.E.+products+for+many+years,+and+have+A.R.E.+certified+installers+on+staff.+We+can+help+you+through+every+step+of+the+process,+and+find+the+right+solutions+for+your+truck+accessory+needs.`,
		DelOpText01: ``,
		DelOpText02: ``,
		HRS_Mon: `Mon:+9:30A+-+5:30P`,
		HRS_Tues: `Tues:+9:30A+-+5:30P`,
		HRS_Wed: `Wed:+9:30A+-+5:30P`,
		HRS_Thurs: `Thurs:+9:30A+-+5:30P`,
		HRS_Fri: `Fri:+9:30A+-+5:30P`,
		HRS_Sat: `Sat:+10A+-+5P`,
		HRS_Sun: `Closed`,
		DelTel1: `805-544-1772`,
		DelAddress: `200+Higeura`,
		DelCity: `San+Luis+Obispo`,
		DelState: `CA`,
		DelZip: `93401`,
		DelCountry: `USA`,
		DelURL: `http://www.4are.com/dealers/dealer.php?WC=SLO&`,
		DelDisclaimer: `The+information+contained+in+this+e-mail+is+intended+solely+for+the+use+of+the+named+addressee.+Access,+copying,+forwarding+or+re-use+of+the+e-mail+or+any+information+contained+therein+by+any+other+person+is+not+authorized.+If+you+are+not+the+intended+recipient,+please+destroy+this+communication.`
	}

	let url_string = ``;
	for (const [key, value] of Object.entries(url_object)) {
		url_string += `${key}=${value}&`;
	}
	
	const raw_review_results = await axios.post(process.env.BASE_URL + process.env.REVIEW_URL + `?` + url_string, {}, {
		headers: {
			Cookie: process.env.LOGGED_IN_COOKIE
		}
	});

	const parsed_review_results = Cheerio.load(raw_review_results['data']);

	url_object = {
		...url_object,
		RMail: parsed_review_results('[name=RMail]').attr('value'),
		SMail: parsed_review_results('[name=RMail]').attr('value'),
		DelContact1: ``,
		DelContact2: ``,
		DelTel2: ``,
		DelAddress_1: `200 Higuera`,
		DelAddress_2: ``,
		DelProvince: ``,
		DelCZip: ``,
		RTText07: ``,
		RTText08: ``,
		RTText09: ``,
		RTText10: ``,
		RTText11: ``,
		RTText12: ``,
		RTText13: ``,
		RTText14: ``,
		RTText16: ``,
		RTText17: ``,
		RTText18: ``,
		RTText19: ``,
		RTText20: ``,
		DelOpText03: ``,
		DelOpText04: ``,
		DelOpText05: ``,
		DelOpText06: ``,
		DelOpText07: ``,
		Subject: `Re: A.R.E. Information Request`,
		File1: ``,
		File2: ``,
		File3: ``
	}



	const formData = new FormData();
	for (const [key, value] of Object.entries(url_object)) {
		formData.append(key, value);
	}
	const final_post_results = await axios.post(process.env.BASE_URL + process.env.FINAL_POST, formData , {
		headers: {
			Cookie: process.env.LOGGED_IN_COOKIE
		}
	});
	
	console.log(final_post_results);

}

main();