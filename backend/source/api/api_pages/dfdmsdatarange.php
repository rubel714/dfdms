<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{

	try {
		$dbh = new Db();
		$FiledTypeId = trim($data->FiledTypeId) ? trim($data->FiledTypeId) : "";
		$DataRange = trim($data->DataRange) ? trim($data->DataRange) : "";

		$DBFieldArray = [
			"CowNative",
			"CowCross",
			"MilkCow",
			"CowBullNative",
			"CowBullCross",
			"CowCalfMaleNative",
			"CowCalfMaleCross",
			"CowCalfFemaleNative",
			"CowCalfFemaleCross",
			"CowMilkProductionNative",
			"CowMilkProductionCross",
			"BuffaloAdultMale",
			"BuffaloAdultFemale",
			"BuffaloCalfMale",
			"BuffaloCalfFemale",
			"BuffaloMilkProduction",
			"GoatAdultMale",
			"GoatAdultFemale",
			"GoatCalfMale",
			"GoatCalfFemale",
			"SheepAdultMale",
			"SheepAdultFemale",
			"SheepCalfMale",
			"SheepCalfFemale",
			"GoatSheepMilkProduction",
			"ChickenNative",
			"ChickenLayer",
			"ChickenBroiler",
			"ChickenSonali",
			"ChickenSonaliFayoumiCockerelOthers",
			"ChickenEgg",
			"DucksNumber",
			"DucksEgg",
			"PigeonNumber",
			"QuailNumber",
			"OtherAnimalNumber",
			"LandTotal",
			"LandOwn",
			"LandLeased"
		];


		$ReportFieldArray = array();
		if ($FiledTypeId == "") {
			$ReportFieldArray = $DBFieldArray;
		} else {
			$ReportFieldArray[] = $FiledTypeId;
		}


		$ReportRangeArray = array();

		$validRangePattern = '/^(\d+)(,\d+)*$/';

		if (!preg_match($validRangePattern, $DataRange)) {
			$DataRange = ""; 
		}

		if ($DataRange == "") {
			$ReportRangeArray[] = array("min" => 0, "max" => "", "colname" => "col0");
		} else {
			$ranges = explode(",", $DataRange);
			$min = 0;
			foreach ($ranges as $index => $range) {
				$max = (int) $range;
				$ReportRangeArray[] = array("min" => $min, "max" => $max, "colname" => "col" . $index);
				$min = $max + 1;
			}
			$ReportRangeArray[] = array("min" => $min, "max" => "", "colname" => "col" . count($ranges));
		}



		foreach ($ReportFieldArray as $idx => $fieldname) {
			$sql = "SELECT ";
			foreach ($ReportRangeArray as $idx1 => $range) {
				if ($range["max"] == "") {
					$sql .= "SUM(CASE WHEN $fieldname > {$range["min"]} THEN 1 ELSE 0 END) AS {$range["colname"]}";
				} else {
					$sql .= "SUM(CASE WHEN $fieldname > {$range["min"]} AND $fieldname <= {$range["max"]} THEN 1 ELSE 0 END) AS {$range["colname"]}";
				}
				if ($idx1 < count($ReportRangeArray) - 1) {
					$sql .= ", ";
				}
			}
			$sql .= " FROM t_householdlivestocksurvey WHERE IFNULL($fieldname, 0) > 0";
		}

		$resultdata = $dbh->query($sql);


		$fieldLabel = array(
			"CowNative" => "Cow (গাভীর সংখ্যা) Native (দেশি)",
			"CowCross" => "Cow (গাভীর সংখ্যা) Cross (শংকর)",
			"MilkCow" => "এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা",
			"CowBullNative" => "Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা) Native (দেশি)",
			"CowBullCross" => "Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা) Cross (শংকর)",
			"CowCalfMaleNative" => "Calf Male (এঁড়ে বাছুর সংখ্যা) Native (দেশি)",
			"CowCalfMaleCross" => "Calf Male (এঁড়ে বাছুর সংখ্যা) Cross (শংকর)",
			"CowCalfFemaleNative" => "Calf Female (বকনা বাছুর সংখ্যা) Native (দেশি)",
			"CowCalfFemaleCross" => "Calf Female (বকনা বাছুর সংখ্যা) Cross (শংকর)",
			"CowMilkProductionNative" => "Household/Farm Total (Cows) Milk Production per day (Liter)(দৈনিক দুধের পরিমাণ (লিটার)) Native (দেশি)",
			"CowMilkProductionCross" => "Household/Farm Total (Cows) Milk Production per day (Liter)(দৈনিক দুধের পরিমাণ (লিটার)) Cross (শংকর)",
			"BuffaloAdultMale" => "Adult Buffalo (মহিষের সংখ্যা) Male (ষাঁড়)",
			"BuffaloAdultFemale" => "Adult Buffalo (মহিষের সংখ্যা) Female (স্ত্রী)",
			"BuffaloCalfMale" => "Calf Buffalo (বাছুর মহিষের সংখ্যা) Male (এঁড়ে বাছুর)",
			"BuffaloCalfFemale" => "Calf Buffalo (বাছুর মহিষের সংখ্যা) Female (বকনা)",
			"BuffaloMilkProduction" => "Household/Farm Total (Buffalo) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))",
			"GoatAdultMale" => "Adult Goat (ছাগল সংখ্যা) Male (পাঁঠা/খাসি)",
			"GoatAdultFemale" => "Adult Goat (ছাগল সংখ্যা) Female (ছাগী)",
			"GoatCalfMale" => "Calf (ছাগল বাচ্চার সংখ্যা) Male (পুং)",
			"GoatCalfFemale" => "Calf (ছাগল বাচ্চার সংখ্যা) Female (স্ত্রী)",
			"SheepAdultMale" => "Adult Sheep (ভেড়ার সংখ্যা) Male (পাঁঠা/খাসি)",
			"SheepAdultFemale" => "Adult Sheep (ভেড়ার সংখ্যা) Female (ভেড়ি)",
			"SheepCalfMale" => "Calf (ভেড়া বাচ্চার সংখ্যা) Male (পুং)",
			"SheepCalfFemale" => "Calf (ভেড়া বাচ্চার সংখ্যা) Female (স্ত্রী)",
			"GoatSheepMilkProduction" => "Household/Farm Total (Goat) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))",
			"ChickenNative" => "Chicken (মুরগির সংখ্যা) Native (দেশি)",
			"ChickenLayer" => "Chicken (মুরগির সংখ্যা) Layer (লেয়ার)",
			"ChickenBroiler" => "Chicken (মুরগির সংখ্যা) Broiler (ব্রয়লার)",
			"ChickenSonali" => "Chicken (মুরগির সংখ্যা) Sonali (সোনালী)",
			"ChickenSonaliFayoumiCockerelOthers" => "Chicken (মুরগির সংখ্যা) Other Poultry (Fayoumi/ Cockerel/ Turkey)( ফাউমি / ককরেল/ টারকি)",
			"ChickenEgg" => "Household/Farm Total (Chicken) Daily Egg Production (দৈনিক ডিম উৎপাদন)",
			"DucksNumber" => "Number of Ducks/Goose (হাঁসের/রাজহাঁসের সংখ্যা)",
			"DucksEgg" => "Household/Farm Total (Duck) Daily Egg Production (দৈনিক ডিম উৎপাদন)",
			"PigeonNumber" => "Number of Pigeon (কবুতরের সংখ্যা)",
			"QuailNumber" => "Number of Quail (কোয়েলের সংখ্যা)",
			"OtherAnimalNumber" => "Number of other animals (Pig/Horse) (অন্যান্য প্রাণীর সংখ্যা (শুকর/ঘোড়া))",
			"LandTotal" => "Total cultivable land in decimal (মোট চাষ যোগ্য জমির পরিমাণ (শতাংশ))",
			"LandOwn" => "Own land for Fodder cultivation (নিজস্ব ঘাস চাষের জমি (শতাংশ))",
			"LandLeased" => "Leased land for fodder cultivation (লিজ নেয়া ঘাস চাষের জমি (শতাংশ))"
		);



		$dataList = array();
		foreach ($ReportFieldArray as $fieldname) {
			$label = $fieldLabel[$fieldname];  // Get the field label

			foreach ($resultdata as $key => $row) {
				foreach ($ReportRangeArray as $idx1 => $range) {
					$rangeDesc = "";
					if ($range["max"] == "") {
						$rangeDesc = "HH Count > " . $range["min"];
					} else {
						$rangeDesc = "HH Count " . ($range["min"] + 1) . "-" . $range["max"];
					}

					$dataList[] = [
						"field" => $label,
						"range" => $rangeDesc,
						"colname" => $row[$range['colname']]
					];
				}
			}
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	$dbh->CloseConnection();
	/**Close database connection */
	return $returnData;
}
