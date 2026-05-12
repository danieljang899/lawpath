import { useState, useRef, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const COLORS = {
  teal: "#0d9488",
  tealDark: "#0f766e",
  tealBg: "#f0fdfa",
  tealMid: "#ccfbf1",
  white: "#ffffff",
  offWhite: "#f8fafc",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  light: "#94a3b8",
};

const NAV_ITEMS = ["Statement Review", "School Research", "Application Tracker", "AI Assistant"];

const ALL_SCHOOLS = [
  { name: "Yale Law School", location: "New Haven, CT", medianLSAT: 174, medianGPA: 3.93, acceptRate: "6%", vibe: "Elite, public interest focused, collaborative" },
  { name: "Harvard Law School", location: "Cambridge, MA", medianLSAT: 174, medianGPA: 3.92, acceptRate: "7%", vibe: "Prestigious, competitive, vast opportunities" },
  { name: "Stanford Law School", location: "Palo Alto, CA", medianLSAT: 174, medianGPA: 3.9, acceptRate: "8%", vibe: "Innovative, Silicon Valley adjacent, collaborative" },
  { name: "Columbia Law School", location: "New York, NY", medianLSAT: 174, medianGPA: 3.92, acceptRate: "12%", vibe: "Urban, career-driven, finance-oriented" },
  { name: "University of Chicago Law School", location: "Chicago, IL", medianLSAT: 173, medianGPA: 3.9, acceptRate: "13%", vibe: "Intellectual, rigorous, debate-driven" },
  { name: "NYU School of Law", location: "New York, NY", medianLSAT: 173, medianGPA: 3.86, acceptRate: "16%", vibe: "Diverse, progressive, NYC-connected" },
  { name: "University of Pennsylvania Carey Law School", location: "Philadelphia, PA", medianLSAT: 173, medianGPA: 3.9, acceptRate: "15%", vibe: "Prestigious, interdisciplinary, Ivy League network" },
  { name: "Duke University School of Law", location: "Durham, NC", medianLSAT: 171, medianGPA: 3.87, acceptRate: "17%", vibe: "Collaborative, strong clinicals, research-focused" },
  { name: "University of Michigan Law School", location: "Ann Arbor, MI", medianLSAT: 171, medianGPA: 3.85, acceptRate: "18%", vibe: "Top public, collegial, strong alumni network" },
  { name: "Northwestern Pritzker School of Law", location: "Chicago, IL", medianLSAT: 171, medianGPA: 3.85, acceptRate: "17%", vibe: "Business-focused, urban, practical" },
  { name: "Cornell Law School", location: "Ithaca, NY", medianLSAT: 170, medianGPA: 3.82, acceptRate: "19%", vibe: "Ivy League, international focus, close-knit" },
  { name: "Georgetown University Law Center", location: "Washington, DC", medianLSAT: 171, medianGPA: 3.85, acceptRate: "17%", vibe: "Policy-oriented, politically connected, large cohort" },
  { name: "University of Virginia School of Law", location: "Charlottesville, VA", medianLSAT: 171, medianGPA: 3.89, acceptRate: "16%", vibe: "Collegial, strong clerkship culture, beautiful campus" },
  { name: "University of Texas School of Law", location: "Austin, TX", medianLSAT: 170, medianGPA: 3.76, acceptRate: "18%", vibe: "Texas-focused, practical, strong regional network" },
  { name: "Vanderbilt University Law School", location: "Nashville, TN", medianLSAT: 170, medianGPA: 3.86, acceptRate: "20%", vibe: "Friendly, rising reputation, strong placement" },
  { name: "Washington University School of Law", location: "St. Louis, MO", medianLSAT: 170, medianGPA: 3.85, acceptRate: "22%", vibe: "Generous scholarships, strong Midwest presence" },
  { name: "UCLA School of Law", location: "Los Angeles, CA", medianLSAT: 170, medianGPA: 3.8, acceptRate: "20%", vibe: "Top public, entertainment law, California focus" },
  { name: "University of Southern California Gould School of Law", location: "Los Angeles, CA", medianLSAT: 168, medianGPA: 3.79, acceptRate: "24%", vibe: "Entertainment, business law, strong LA network" },
  { name: "Boston University School of Law", location: "Boston, MA", medianLSAT: 168, medianGPA: 3.77, acceptRate: "23%", vibe: "Strong clinicals, urban, diverse specializations" },
  { name: "Emory University School of Law", location: "Atlanta, GA", medianLSAT: 167, medianGPA: 3.74, acceptRate: "26%", vibe: "Strong Southeast presence, public interest focus" },
  { name: "George Washington University Law School", location: "Washington, DC", medianLSAT: 168, medianGPA: 3.79, acceptRate: "25%", vibe: "DC-connected, policy, government law" },
  { name: "University of Notre Dame Law School", location: "Notre Dame, IN", medianLSAT: 167, medianGPA: 3.77, acceptRate: "24%", vibe: "Values-driven, tight-knit, strong alumni loyalty" },
  { name: "University of Minnesota Law School", location: "Minneapolis, MN", medianLSAT: 166, medianGPA: 3.72, acceptRate: "36%", vibe: "Top public, strong Midwest network" },
  { name: "University of Alabama School of Law", location: "Tuscaloosa, AL", medianLSAT: 164, medianGPA: 3.72, acceptRate: "35%", vibe: "Affordable, strong Southern network, practical" },
  { name: "University of Georgia School of Law", location: "Athens, GA", medianLSAT: 166, medianGPA: 3.75, acceptRate: "30%", vibe: "Top public, strong Georgia placement, affordable" },
  { name: "University of Florida Levin College of Law", location: "Gainesville, FL", medianLSAT: 163, medianGPA: 3.67, acceptRate: "32%", vibe: "Top public, Florida market, affordable" },
  { name: "University of North Carolina School of Law", location: "Chapel Hill, NC", medianLSAT: 163, medianGPA: 3.64, acceptRate: "33%", vibe: "Top public, collaborative, strong NC network" },
  { name: "Ohio State University Moritz College of Law", location: "Columbus, OH", medianLSAT: 163, medianGPA: 3.63, acceptRate: "38%", vibe: "Top public, strong Ohio network, practical" },
  { name: "University of Wisconsin Law School", location: "Madison, WI", medianLSAT: 161, medianGPA: 3.58, acceptRate: "40%", vibe: "Progressive, diploma privilege state, affordable" },
  { name: "Indiana University Maurer School of Law", location: "Bloomington, IN", medianLSAT: 161, medianGPA: 3.6, acceptRate: "39%", vibe: "Top public, strong Midwest network, affordable" },
  { name: "University of Iowa College of Law", location: "Iowa City, IA", medianLSAT: 160, medianGPA: 3.57, acceptRate: "42%", vibe: "Affordable, strong public interest, close community" },
  { name: "University of Colorado Law School", location: "Boulder, CO", medianLSAT: 163, medianGPA: 3.67, acceptRate: "35%", vibe: "Top public, environmental law, Colorado market" },
  { name: "University of Washington School of Law", location: "Seattle, WA", medianLSAT: 163, medianGPA: 3.6, acceptRate: "20%", vibe: "Top public, Pacific Northwest, tech and environment" },
  { name: "Boston College Law School", location: "Newton, MA", medianLSAT: 167, medianGPA: 3.73, acceptRate: "28%", vibe: "Jesuit values, Boston market, strong clinicals" },
  { name: "Fordham University School of Law", location: "New York, NY", medianLSAT: 166, medianGPA: 3.72, acceptRate: "27%", vibe: "NYC access, strong business law, Jesuit mission" },
  { name: "William & Mary Law School", location: "Williamsburg, VA", medianLSAT: 163, medianGPA: 3.66, acceptRate: "33%", vibe: "Historic, strong clerkship culture, affordable" },
  { name: "Tulane University Law School", location: "New Orleans, LA", medianLSAT: 160, medianGPA: 3.52, acceptRate: "45%", vibe: "Unique civil law system, vibrant city, maritime law" },
  { name: "University of Illinois College of Law", location: "Champaign, IL", medianLSAT: 162, medianGPA: 3.6, acceptRate: "38%", vibe: "Top public, affordable, strong Illinois network" },
  { name: "Arizona State University Sandra Day O'Connor College of Law", location: "Phoenix, AZ", medianLSAT: 161, medianGPA: 3.54, acceptRate: "36%", vibe: "Innovative, growing reputation, Southwest market" },
  { name: "University of Arizona James E. Rogers College of Law", location: "Tucson, AZ", medianLSAT: 158, medianGPA: 3.49, acceptRate: "42%", vibe: "Affordable, Southwest focus, public interest" },
  { name: "George Mason University Antonin Scalia Law School", location: "Arlington, VA", medianLSAT: 162, medianGPA: 3.57, acceptRate: "34%", vibe: "Law and economics, DC adjacent, conservative leaning" },
  { name: "Wake Forest University School of Law", location: "Winston-Salem, NC", medianLSAT: 161, medianGPA: 3.6, acceptRate: "37%", vibe: "Small class sizes, practical, strong Southeast network" },
  { name: "University of Utah S.J. Quinney College of Law", location: "Salt Lake City, UT", medianLSAT: 160, medianGPA: 3.63, acceptRate: "38%", vibe: "Top public, affordable, strong Utah market" },
  { name: "Brigham Young University J. Reuben Clark Law School", location: "Provo, UT", medianLSAT: 163, medianGPA: 3.73, acceptRate: "30%", vibe: "Faith-based, affordable, strong community" },
  { name: "University of Tennessee College of Law", location: "Knoxville, TN", medianLSAT: 158, medianGPA: 3.53, acceptRate: "40%", vibe: "Affordable, strong Tennessee network, practical" },
  { name: "University of Kentucky College of Law", location: "Lexington, KY", medianLSAT: 156, medianGPA: 3.52, acceptRate: "44%", vibe: "Affordable, strong Kentucky network, close community" },
  { name: "University of Missouri School of Law", location: "Columbia, MO", medianLSAT: 155, medianGPA: 3.43, acceptRate: "46%", vibe: "Affordable, strong Missouri network, practical" },
  { name: "University of Kansas School of Law", location: "Lawrence, KS", medianLSAT: 155, medianGPA: 3.44, acceptRate: "48%", vibe: "Affordable, strong Kansas network, close community" },
  { name: "University of Nebraska College of Law", location: "Lincoln, NE", medianLSAT: 154, medianGPA: 3.44, acceptRate: "50%", vibe: "Affordable, strong Nebraska network, practical" },
  { name: "University of Oklahoma College of Law", location: "Norman, OK", medianLSAT: 156, medianGPA: 3.44, acceptRate: "47%", vibe: "Affordable, energy law, strong Oklahoma network" },
  { name: "University of Arkansas School of Law", location: "Fayetteville, AR", medianLSAT: 154, medianGPA: 3.39, acceptRate: "52%", vibe: "Affordable, strong Arkansas network, practical" },
  { name: "University of Mississippi School of Law", location: "Oxford, MS", medianLSAT: 153, medianGPA: 3.38, acceptRate: "54%", vibe: "Affordable, strong Mississippi network, close community" },
  { name: "Louisiana State University Paul M. Hebert Law Center", location: "Baton Rouge, LA", medianLSAT: 154, medianGPA: 3.42, acceptRate: "50%", vibe: "Civil law tradition, affordable, strong Louisiana market" },
  { name: "University of South Carolina School of Law", location: "Columbia, SC", medianLSAT: 155, medianGPA: 3.42, acceptRate: "48%", vibe: "Affordable, strong SC network, practical" },
  { name: "University of New Mexico School of Law", location: "Albuquerque, NM", medianLSAT: 153, medianGPA: 3.3, acceptRate: "42%", vibe: "Top public, Native American law, Southwest focus" },
  { name: "University of Nevada Las Vegas William S. Boyd School of Law", location: "Las Vegas, NV", medianLSAT: 155, medianGPA: 3.44, acceptRate: "30%", vibe: "Growing, Nevada market, gaming and entertainment law" },
  { name: "University of Hawaii William S. Richardson School of Law", location: "Honolulu, HI", medianLSAT: 155, medianGPA: 3.33, acceptRate: "22%", vibe: "Pacific focus, indigenous law, unique market" },
  { name: "University of Maine School of Law", location: "Portland, ME", medianLSAT: 152, medianGPA: 3.26, acceptRate: "48%", vibe: "Small, affordable, strong Maine market" },
  { name: "Vermont Law School", location: "South Royalton, VT", medianLSAT: 149, medianGPA: 3.1, acceptRate: "60%", vibe: "Environmental law focus, small, progressive" },
  { name: "University of Oregon School of Law", location: "Eugene, OR", medianLSAT: 158, medianGPA: 3.36, acceptRate: "38%", vibe: "Environmental law, Pacific Northwest, progressive" },
  { name: "Lewis & Clark Law School", location: "Portland, OR", medianLSAT: 157, medianGPA: 3.38, acceptRate: "40%", vibe: "Environmental law leader, Portland market" },
  { name: "Willamette University College of Law", location: "Salem, OR", medianLSAT: 151, medianGPA: 3.2, acceptRate: "58%", vibe: "Small, Oregon market, practical" },
  { name: "University of Montana Alexander Blewett III School of Law", location: "Missoula, MT", medianLSAT: 152, medianGPA: 3.22, acceptRate: "50%", vibe: "Small, natural resources law, Montana market" },
  { name: "University of North Dakota School of Law", location: "Grand Forks, ND", medianLSAT: 149, medianGPA: 3.24, acceptRate: "55%", vibe: "Affordable, energy law, strong ND network" },
  { name: "University of South Dakota School of Law", location: "Vermillion, SD", medianLSAT: 148, medianGPA: 3.19, acceptRate: "58%", vibe: "Affordable, strong SD network, small community" },
  { name: "University of Wyoming College of Law", location: "Laramie, WY", medianLSAT: 153, medianGPA: 3.32, acceptRate: "44%", vibe: "Small, natural resources, affordable" },
  { name: "University of Idaho College of Law", location: "Moscow, ID", medianLSAT: 151, medianGPA: 3.18, acceptRate: "52%", vibe: "Affordable, natural resources, Idaho market" },
  { name: "Gonzaga University School of Law", location: "Spokane, WA", medianLSAT: 153, medianGPA: 3.24, acceptRate: "50%", vibe: "Jesuit values, Pacific Northwest, small community" },
  { name: "Seattle University School of Law", location: "Seattle, WA", medianLSAT: 157, medianGPA: 3.3, acceptRate: "42%", vibe: "Jesuit, social justice focus, Seattle market" },
  { name: "Chapman University Dale E. Fowler School of Law", location: "Orange, CA", medianLSAT: 157, medianGPA: 3.38, acceptRate: "44%", vibe: "Southern California market, practical, growing" },
  { name: "Loyola Law School Los Angeles", location: "Los Angeles, CA", medianLSAT: 158, medianGPA: 3.44, acceptRate: "40%", vibe: "Jesuit, LA market, entertainment and entertainment law" },
  { name: "Pepperdine Caruso School of Law", location: "Malibu, CA", medianLSAT: 160, medianGPA: 3.52, acceptRate: "36%", vibe: "Faith-based, beautiful campus, dispute resolution" },
  { name: "Southwestern Law School", location: "Los Angeles, CA", medianLSAT: 153, medianGPA: 3.2, acceptRate: "52%", vibe: "LA market, entertainment focus, diverse" },
  { name: "University of San Diego School of Law", location: "San Diego, CA", medianLSAT: 158, medianGPA: 3.44, acceptRate: "40%", vibe: "Catholic, San Diego market, international law" },
  { name: "University of San Francisco School of Law", location: "San Francisco, CA", medianLSAT: 155, medianGPA: 3.25, acceptRate: "48%", vibe: "Jesuit, Bay Area market, social justice" },
  { name: "Santa Clara University School of Law", location: "Santa Clara, CA", medianLSAT: 156, medianGPA: 3.3, acceptRate: "46%", vibe: "Silicon Valley adjacent, tech law, Jesuit" },
  { name: "Golden Gate University School of Law", location: "San Francisco, CA", medianLSAT: 150, medianGPA: 3.06, acceptRate: "60%", vibe: "Bay Area market, practical, diverse" },
  { name: "UC Hastings College of the Law", location: "San Francisco, CA", medianLSAT: 163, medianGPA: 3.55, acceptRate: "28%", vibe: "Top public, Bay Area market, practical" },
  { name: "UC Berkeley School of Law", location: "Berkeley, CA", medianLSAT: 170, medianGPA: 3.82, acceptRate: "19%", vibe: "Top public, progressive, Bay Area, elite" },
  { name: "UC Davis School of Law", location: "Davis, CA", medianLSAT: 161, medianGPA: 3.5, acceptRate: "30%", vibe: "Top public, public interest, California market" },
  { name: "UC Irvine School of Law", location: "Irvine, CA", medianLSAT: 163, medianGPA: 3.56, acceptRate: "25%", vibe: "Young school, innovative, Southern California" },
  { name: "Thomas Jefferson School of Law", location: "San Diego, CA", medianLSAT: 146, medianGPA: 2.96, acceptRate: "70%", vibe: "Open access, San Diego market, practical" },
  { name: "Western State College of Law", location: "Irvine, CA", medianLSAT: 146, medianGPA: 2.98, acceptRate: "68%", vibe: "Accessible, California market, practical" },
  { name: "Whittier Law School", location: "Costa Mesa, CA", medianLSAT: 144, medianGPA: 2.85, acceptRate: "72%", vibe: "Accessible, Southern California market" },
  { name: "University of Denver Sturm College of Law", location: "Denver, CO", medianLSAT: 157, medianGPA: 3.37, acceptRate: "42%", vibe: "Rocky Mountain market, practical, growing city" },
  { name: "University of New Hampshire Franklin Pierce School of Law", location: "Concord, NH", medianLSAT: 153, medianGPA: 3.3, acceptRate: "50%", vibe: "IP law leader, small, New England market" },
  { name: "Northeastern University School of Law", location: "Boston, MA", medianLSAT: 160, medianGPA: 3.52, acceptRate: "36%", vibe: "Co-op program, social justice, Boston market" },
  { name: "Suffolk University Law School", location: "Boston, MA", medianLSAT: 153, medianGPA: 3.2, acceptRate: "52%", vibe: "Boston market, practical, diverse" },
  { name: "New England Law Boston", location: "Boston, MA", medianLSAT: 148, medianGPA: 3.06, acceptRate: "62%", vibe: "Accessible, Boston market, practical" },
  { name: "Roger Williams University School of Law", location: "Bristol, RI", medianLSAT: 151, medianGPA: 3.16, acceptRate: "56%", vibe: "Small, New England market, practical" },
  { name: "Quinnipiac University School of Law", location: "Hamden, CT", medianLSAT: 152, medianGPA: 3.18, acceptRate: "54%", vibe: "Small, Connecticut market, health law" },
  { name: "University of Connecticut School of Law", location: "Hartford, CT", medianLSAT: 158, medianGPA: 3.48, acceptRate: "38%", vibe: "Top public, Connecticut market, insurance law" },
  { name: "Pace University Elizabeth Haub School of Law", location: "White Plains, NY", medianLSAT: 151, medianGPA: 3.14, acceptRate: "56%", vibe: "Environmental law, NYC adjacent, practical" },
  { name: "New York Law School", location: "New York, NY", medianLSAT: 152, medianGPA: 3.16, acceptRate: "54%", vibe: "NYC market, practical, diverse" },
  { name: "Brooklyn Law School", location: "Brooklyn, NY", medianLSAT: 155, medianGPA: 3.28, acceptRate: "48%", vibe: "NYC market, practical, strong alumni" },
  { name: "St. John's University School of Law", location: "Jamaica, NY", medianLSAT: 155, medianGPA: 3.3, acceptRate: "46%", vibe: "Catholic, NYC market, practical" },
  { name: "Hofstra University Maurice A. Deane School of Law", location: "Hempstead, NY", medianLSAT: 153, medianGPA: 3.22, acceptRate: "50%", vibe: "Long Island market, practical, diverse" },
  { name: "Touro Law Center", location: "Central Islip, NY", medianLSAT: 148, medianGPA: 3.0, acceptRate: "64%", vibe: "Accessible, New York market, practical" },
  { name: "Albany Law School", location: "Albany, NY", medianLSAT: 150, medianGPA: 3.1, acceptRate: "58%", vibe: "Government law, New York market, practical" },
  { name: "Syracuse University College of Law", location: "Syracuse, NY", medianLSAT: 154, medianGPA: 3.32, acceptRate: "50%", vibe: "Upstate NY market, practical, diverse" },
  { name: "Buffalo Law School", location: "Buffalo, NY", medianLSAT: 155, medianGPA: 3.32, acceptRate: "38%", vibe: "Top public, Western NY market, affordable" },
  { name: "Rutgers Law School", location: "Newark/Camden, NJ", medianLSAT: 157, medianGPA: 3.4, acceptRate: "36%", vibe: "Top public, NJ/NYC market, affordable" },
  { name: "Seton Hall University School of Law", location: "Newark, NJ", medianLSAT: 155, medianGPA: 3.28, acceptRate: "46%", vibe: "Catholic, NJ/NYC market, health law" },
  { name: "Temple University Beasley School of Law", location: "Philadelphia, PA", medianLSAT: 159, medianGPA: 3.46, acceptRate: "32%", vibe: "Top public, Philadelphia market, affordable" },
  { name: "Villanova University Charles Widger School of Law", location: "Villanova, PA", medianLSAT: 158, medianGPA: 3.52, acceptRate: "38%", vibe: "Catholic, Philadelphia market, tax law" },
  { name: "Drexel University Thomas R. Kline School of Law", location: "Philadelphia, PA", medianLSAT: 154, medianGPA: 3.28, acceptRate: "48%", vibe: "Philadelphia market, practical, co-op program" },
  { name: "Duquesne University School of Law", location: "Pittsburgh, PA", medianLSAT: 151, medianGPA: 3.22, acceptRate: "54%", vibe: "Catholic, Pittsburgh market, practical" },
  { name: "Penn State Law", location: "University Park, PA", medianLSAT: 155, medianGPA: 3.38, acceptRate: "44%", vibe: "Pennsylvania market, international law, growing" },
  { name: "University of Pittsburgh School of Law", location: "Pittsburgh, PA", medianLSAT: 158, medianGPA: 3.5, acceptRate: "36%", vibe: "Top public, Pittsburgh market, health law" },
  { name: "University of Maryland Francis King Carey School of Law", location: "Baltimore, MD", medianLSAT: 158, medianGPA: 3.48, acceptRate: "34%", vibe: "Top public, DC/Baltimore market, affordable" },
  { name: "University of Baltimore School of Law", location: "Baltimore, MD", medianLSAT: 152, medianGPA: 3.14, acceptRate: "52%", vibe: "Baltimore market, practical, affordable" },
  { name: "Howard University School of Law", location: "Washington, DC", medianLSAT: 153, medianGPA: 3.22, acceptRate: "22%", vibe: "HBCU, civil rights legacy, DC market" },
  { name: "American University Washington College of Law", location: "Washington, DC", medianLSAT: 160, medianGPA: 3.56, acceptRate: "32%", vibe: "DC-connected, international law, advocacy" },
  { name: "Catholic University Columbus School of Law", location: "Washington, DC", medianLSAT: 153, medianGPA: 3.22, acceptRate: "48%", vibe: "Catholic, DC market, practical" },
  { name: "University of Richmond School of Law", location: "Richmond, VA", medianLSAT: 158, medianGPA: 3.46, acceptRate: "36%", vibe: "Virginia market, practical, strong alumni" },
  { name: "Washington and Lee University School of Law", location: "Lexington, VA", medianLSAT: 161, medianGPA: 3.62, acceptRate: "32%", vibe: "Small, elite feel, strong clerkship culture" },
  { name: "Appalachian School of Law", location: "Grundy, VA", medianLSAT: 143, medianGPA: 2.8, acceptRate: "74%", vibe: "Accessible, rural focus, Virginia market" },
  { name: "Regent University School of Law", location: "Virginia Beach, VA", medianLSAT: 150, medianGPA: 3.1, acceptRate: "56%", vibe: "Christian values, Virginia market, practical" },
  { name: "Liberty University School of Law", location: "Lynchburg, VA", medianLSAT: 148, medianGPA: 3.06, acceptRate: "60%", vibe: "Christian values, Virginia market, practical" },
  { name: "Charlotte School of Law", location: "Charlotte, NC", medianLSAT: 144, medianGPA: 2.86, acceptRate: "72%", vibe: "Accessible, Charlotte market" },
  { name: "Campbell University Norman Adrian Wiggins School of Law", location: "Raleigh, NC", medianLSAT: 150, medianGPA: 3.08, acceptRate: "56%", vibe: "Christian values, NC market, practical" },
  { name: "Elon University School of Law", location: "Greensboro, NC", medianLSAT: 151, medianGPA: 3.12, acceptRate: "54%", vibe: "Small, NC market, practical" },
  { name: "Belmont University College of Law", location: "Nashville, TN", medianLSAT: 152, medianGPA: 3.2, acceptRate: "52%", vibe: "Christian values, Nashville market, growing" },
  { name: "University of Memphis Cecil C. Humphreys School of Law", location: "Memphis, TN", medianLSAT: 151, medianGPA: 3.16, acceptRate: "44%", vibe: "Affordable, Memphis market, practical" },
  { name: "University of Louisville Louis D. Brandeis School of Law", location: "Louisville, KY", medianLSAT: 152, medianGPA: 3.26, acceptRate: "46%", vibe: "Affordable, Kentucky market, practical" },
  { name: "Northern Kentucky University Salmon P. Chase College of Law", location: "Highland Heights, KY", medianLSAT: 148, medianGPA: 3.04, acceptRate: "58%", vibe: "Accessible, Cincinnati/Kentucky market, practical" },
  { name: "University of Cincinnati College of Law", location: "Cincinnati, OH", medianLSAT: 156, medianGPA: 3.4, acceptRate: "42%", vibe: "Top public, Ohio market, affordable" },
  { name: "University of Akron School of Law", location: "Akron, OH", medianLSAT: 150, medianGPA: 3.08, acceptRate: "56%", vibe: "Affordable, Ohio market, IP law" },
  { name: "Cleveland State University Cleveland-Marshall College of Law", location: "Cleveland, OH", medianLSAT: 150, medianGPA: 3.08, acceptRate: "54%", vibe: "Affordable, Cleveland market, practical" },
  { name: "Case Western Reserve University School of Law", location: "Cleveland, OH", medianLSAT: 158, medianGPA: 3.48, acceptRate: "38%", vibe: "Health law, IP, Cleveland market" },
  { name: "University of Toledo College of Law", location: "Toledo, OH", medianLSAT: 148, medianGPA: 3.02, acceptRate: "58%", vibe: "Affordable, Ohio market, practical" },
  { name: "Capital University Law School", location: "Columbus, OH", medianLSAT: 147, medianGPA: 3.0, acceptRate: "62%", vibe: "Accessible, Columbus market, practical" },
  { name: "Marquette University Law School", location: "Milwaukee, WI", medianLSAT: 153, medianGPA: 3.24, acceptRate: "50%", vibe: "Catholic, Wisconsin market, practical" },
  { name: "Mitchell Hamline School of Law", location: "Saint Paul, MN", medianLSAT: 151, medianGPA: 3.12, acceptRate: "54%", vibe: "Minnesota market, hybrid program, practical" },
  { name: "William Mitchell College of Law", location: "Saint Paul, MN", medianLSAT: 150, medianGPA: 3.1, acceptRate: "56%", vibe: "Minnesota market, practical, accessible" },
  { name: "University of Detroit Mercy School of Law", location: "Detroit, MI", medianLSAT: 149, medianGPA: 3.06, acceptRate: "60%", vibe: "Catholic, Detroit market, practical" },
  { name: "Wayne State University Law School", location: "Detroit, MI", medianLSAT: 153, medianGPA: 3.2, acceptRate: "42%", vibe: "Top public, Detroit market, affordable" },
  { name: "Michigan State University College of Law", location: "East Lansing, MI", medianLSAT: 152, medianGPA: 3.18, acceptRate: "50%", vibe: "Michigan market, practical, growing" },
  { name: "Western Michigan University Cooley Law School", location: "Lansing, MI", medianLSAT: 142, medianGPA: 2.76, acceptRate: "78%", vibe: "Accessible, Michigan market, practical" },
  { name: "University of Illinois Chicago School of Law", location: "Chicago, IL", medianLSAT: 156, medianGPA: 3.3, acceptRate: "40%", vibe: "Top public, Chicago market, affordable" },
  { name: "Loyola University Chicago School of Law", location: "Chicago, IL", medianLSAT: 157, medianGPA: 3.38, acceptRate: "40%", vibe: "Jesuit, Chicago market, health law" },
  { name: "DePaul University College of Law", location: "Chicago, IL", medianLSAT: 154, medianGPA: 3.26, acceptRate: "46%", vibe: "Chicago market, practical, diverse" },
  { name: "Illinois Institute of Technology Chicago-Kent College of Law", location: "Chicago, IL", medianLSAT: 155, medianGPA: 3.28, acceptRate: "46%", vibe: "Tech law, IP, Chicago market" },
  { name: "Southern Illinois University School of Law", location: "Carbondale, IL", medianLSAT: 148, medianGPA: 3.02, acceptRate: "58%", vibe: "Affordable, Illinois market, practical" },
  { name: "John Marshall Law School", location: "Chicago, IL", medianLSAT: 148, medianGPA: 2.98, acceptRate: "62%", vibe: "Accessible, Chicago market, IP focus" },
  { name: "St. Louis University School of Law", location: "St. Louis, MO", medianLSAT: 154, medianGPA: 3.3, acceptRate: "48%", vibe: "Jesuit, St. Louis market, health law" },
  { name: "University of Missouri Kansas City School of Law", location: "Kansas City, MO", medianLSAT: 152, medianGPA: 3.18, acceptRate: "50%", vibe: "Affordable, Kansas City market, practical" },
  { name: "Drake University Law School", location: "Des Moines, IA", medianLSAT: 152, medianGPA: 3.24, acceptRate: "50%", vibe: "Iowa market, agricultural law, practical" },
  { name: "Creighton University School of Law", location: "Omaha, NE", medianLSAT: 151, medianGPA: 3.16, acceptRate: "54%", vibe: "Jesuit, Nebraska market, practical" },
  { name: "University of South Dakota School of Law", location: "Vermillion, SD", medianLSAT: 147, medianGPA: 3.16, acceptRate: "58%", vibe: "Affordable, SD market, small community" },
  { name: "Baylor University School of Law", location: "Waco, TX", medianLSAT: 162, medianGPA: 3.58, acceptRate: "28%", vibe: "Trial advocacy leader, Christian values, Texas market" },
  { name: "Texas Tech University School of Law", location: "Lubbock, TX", medianLSAT: 157, medianGPA: 3.44, acceptRate: "38%", vibe: "Affordable, Texas market, practical" },
  { name: "South Texas College of Law Houston", location: "Houston, TX", medianLSAT: 153, medianGPA: 3.14, acceptRate: "48%", vibe: "Houston market, trial advocacy, practical" },
  { name: "University of Houston Law Center", location: "Houston, TX", medianLSAT: 160, medianGPA: 3.54, acceptRate: "30%", vibe: "Top public, Houston market, energy law" },
  { name: "Texas Southern University Thurgood Marshall School of Law", location: "Houston, TX", medianLSAT: 146, medianGPA: 2.94, acceptRate: "40%", vibe: "HBCU, civil rights legacy, Houston market" },
  { name: "Southern Methodist University Dedman School of Law", location: "Dallas, TX", medianLSAT: 162, medianGPA: 3.6, acceptRate: "28%", vibe: "Dallas market, corporate law, strong alumni" },
  { name: "Texas A&M University School of Law", location: "Fort Worth, TX", medianLSAT: 157, medianGPA: 3.38, acceptRate: "36%", vibe: "Growing, Texas market, practical, Aggie network" },
  { name: "St. Mary's University School of Law", location: "San Antonio, TX", medianLSAT: 151, medianGPA: 3.1, acceptRate: "52%", vibe: "Catholic, San Antonio market, practical" },
  { name: "University of New Orleans College of Law", location: "New Orleans, LA", medianLSAT: 150, medianGPA: 3.08, acceptRate: "56%", vibe: "Accessible, New Orleans market, civil law" },
  { name: "Southern University Law Center", location: "Baton Rouge, LA", medianLSAT: 144, medianGPA: 2.88, acceptRate: "44%", vibe: "HBCU, Louisiana market, practical" },
  { name: "Florida State University College of Law", location: "Tallahassee, FL", medianLSAT: 160, medianGPA: 3.56, acceptRate: "28%", vibe: "Top public, Florida market, government law" },
  { name: "University of Miami School of Law", location: "Coral Gables, FL", medianLSAT: 159, medianGPA: 3.5, acceptRate: "34%", vibe: "International law, Miami market, tax law" },
  { name: "Nova Southeastern University College of Law", location: "Fort Lauderdale, FL", medianLSAT: 150, medianGPA: 3.06, acceptRate: "54%", vibe: "South Florida market, practical, diverse" },
  { name: "Florida International University College of Law", location: "Miami, FL", medianLSAT: 155, medianGPA: 3.3, acceptRate: "24%", vibe: "Top public, Miami market, international law, affordable" },
  { name: "Barry University Dwayne O. Andreas School of Law", location: "Orlando, FL", medianLSAT: 146, medianGPA: 2.96, acceptRate: "64%", vibe: "Accessible, Florida market, practical" },
  { name: "St. Thomas University School of Law", location: "Miami Gardens, FL", medianLSAT: 148, medianGPA: 3.0, acceptRate: "60%", vibe: "Catholic, Miami market, international law" },
  { name: "Stetson University College of Law", location: "Gulfport, FL", medianLSAT: 153, medianGPA: 3.22, acceptRate: "50%", vibe: "Trial advocacy, Florida market, practical" },
  { name: "Samford University Cumberland School of Law", location: "Birmingham, AL", medianLSAT: 152, medianGPA: 3.24, acceptRate: "50%", vibe: "Christian values, Alabama market, practical" },
  { name: "Faulkner University Thomas Goode Jones School of Law", location: "Montgomery, AL", medianLSAT: 146, medianGPA: 2.96, acceptRate: "64%", vibe: "Christian values, Alabama market, accessible" },
  { name: "Mercer University Walter F. George School of Law", location: "Macon, GA", medianLSAT: 153, medianGPA: 3.22, acceptRate: "48%", vibe: "Small, Georgia market, practical" },
  { name: "Georgia State University College of Law", location: "Atlanta, GA", medianLSAT: 159, medianGPA: 3.5, acceptRate: "22%", vibe: "Top public, Atlanta market, affordable" },
  { name: "John Marshall Law School Atlanta", location: "Atlanta, GA", medianLSAT: 148, medianGPA: 3.0, acceptRate: "60%", vibe: "Accessible, Atlanta market, practical" },
  { name: "University of South Carolina School of Law", location: "Columbia, SC", medianLSAT: 155, medianGPA: 3.42, acceptRate: "48%", vibe: "Top public, SC market, practical" },
  { name: "Charleston School of Law", location: "Charleston, SC", medianLSAT: 149, medianGPA: 3.06, acceptRate: "58%", vibe: "Small, South Carolina market, practical" },
];

async function callClaude(system, userMessage, history = []) {
  const messages = history.length > 0 ? history : [{ role: "user", content: userMessage }];
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system, messages }),
  });
  const data = await response.json();
  return data.content?.map(b => b.text || "").join("") || "";
}

// ─── Statement Review ────────────────────────────────────────────────
function StatementReview() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const words = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  async function analyze() {
    if (words < 50) { setError("Please paste at least 50 words."); return; }
    setError(null); setLoading(true); setResult(null);
    try {
      const sys = `You are an elite law school admissions consultant. Review personal statements and return ONLY raw JSON with no markdown or backticks:
{"overallScore":<1-100>,"verdict":"<one sentence>","strengths":["...","...","..."],"weaknesses":["...","...","..."],"sections":[{"title":"Narrative & Story","score":<1-10>,"feedback":"..."},{"title":"Why Law","score":<1-10>,"feedback":"..."},{"title":"Voice & Authenticity","score":<1-10>,"feedback":"..."},{"title":"Structure & Clarity","score":<1-10>,"feedback":"..."}],"topPriority":"..."}`;
      const raw = await callClaude(sys, `Review this personal statement:\n\n${essay}`);
      setResult(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  }

  const scoreColor = s => s >= 80 ? COLORS.teal : s >= 60 ? "#f59e0b" : "#ef4444";
  const secColor = s => s >= 8 ? COLORS.teal : s >= 6 ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <h2 style={S.sectionTitle}>Personal Statement Review</h2>
      <p style={S.sectionSub}>Paste your draft and get expert-level feedback instantly.</p>
      <div style={S.card}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={S.label}>Your Statement</span>
          <span style={{ fontSize: 12, color: words > 800 ? "#ef4444" : COLORS.light, fontFamily: "DM Sans" }}>{words} words</span>
        </div>
        <textarea value={essay} onChange={e => setEssay(e.target.value)} placeholder="Paste your personal statement here..."
          style={{ width: "100%", minHeight: 200, border: "none", outline: "none", resize: "vertical", fontSize: 15, lineHeight: 1.75, color: COLORS.text, fontFamily: "DM Sans", background: "transparent", boxSizing: "border-box" }} />
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "8px 0" }}>{error}</p>}
      <button onClick={analyze} disabled={loading} style={{ ...S.btn, width: "100%", marginTop: 4 }}>{loading ? "Analyzing..." : "Review My Statement →"}</button>
      {loading && <div style={{ textAlign: "center", padding: "40px 0" }}><div style={S.spinner} /><p style={{ color: COLORS.muted, fontFamily: "DM Sans", fontSize: 14 }}>Reading between the lines...</p></div>}
      {result && (
        <div style={{ marginTop: 32 }}>
          <div style={{ ...S.card, display: "flex", gap: 24, alignItems: "center", borderLeft: `4px solid ${scoreColor(result.overallScore)}`, marginBottom: 16 }}>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 52, fontWeight: 700, color: scoreColor(result.overallScore), fontFamily: "Libre Baskerville", lineHeight: 1 }}>{result.overallScore}</div>
              <div style={{ fontSize: 11, color: COLORS.light, fontFamily: "DM Sans" }}>/ 100</div>
            </div>
            <div><div style={S.label}>Overall Assessment</div><p style={{ margin: "6px 0 0", fontSize: 15, color: COLORS.text, fontFamily: "DM Sans", lineHeight: 1.6 }}>{result.verdict}</p></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16, marginBottom: 16 }}>
            {result.sections.map((s, i) => (
              <div key={i} style={S.card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontFamily: "Libre Baskerville", fontSize: 14, fontWeight: 700, color: COLORS.text }}>{s.title}</span>
                  <span style={{ fontSize: 18, fontWeight: 700, color: secColor(s.score), fontFamily: "Libre Baskerville" }}>{s.score}<span style={{ fontSize: 12, color: COLORS.light }}>/10</span></span>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: COLORS.muted, fontFamily: "DM Sans", lineHeight: 1.65 }}>{s.feedback}</p>
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            {[["Strengths", "#059669", result.strengths, "✓"], ["Weaknesses", "#ef4444", result.weaknesses, "✗"]].map(([label, color, items, icon]) => (
              <div key={label} style={S.card}>
                <div style={{ fontSize: 11, color, textTransform: "uppercase", letterSpacing: 1, fontFamily: "DM Sans", marginBottom: 10 }}>{label}</div>
                {items.map((item, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: COLORS.muted, fontFamily: "DM Sans", lineHeight: 1.5 }}><span style={{ color, flexShrink: 0 }}>{icon}</span>{item}</div>)}
              </div>
            ))}
          </div>
          <div style={{ ...S.card, background: COLORS.tealBg, borderColor: COLORS.tealMid }}>
            <div style={{ fontSize: 11, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 1, fontFamily: "DM Sans", marginBottom: 8 }}>#1 Priority</div>
            <p style={{ margin: 0, fontSize: 15, color: COLORS.text, fontFamily: "DM Sans", lineHeight: 1.7 }}>{result.topPriority}</p>
          </div>
          <button onClick={() => { setResult(null); setEssay(""); }} style={{ ...S.btnOutline, width: "100%", marginTop: 16 }}>Start Over</button>
        </div>
      )}
    </div>
  );
}

// ─── School Research ─────────────────────────────────────────────────
function SchoolResearch({ profile }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const filtered = ALL_SCHOOLS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  async function analyze(school) {
    setSelected(school); setAnalysis(null); setLoading(true);
    const profileCtx = profile.lsat || profile.gpa
      ? `Applicant: LSAT ${profile.lsat || "unknown"}, GPA ${profile.gpa || "unknown"}, Background: ${profile.background || "not specified"}.`
      : "No profile provided — give general advice.";
    try {
      const sys = `You are a law school admissions expert. Return ONLY raw JSON with no markdown:
{"fitScore":<1-100>,"fitVerdict":"<one sentence>","admissionChance":"<Reach/Match/Safety>","reasoning":"<2-3 sentences>","tips":["...","...","..."]}`;
      const raw = await callClaude(sys, `Evaluate fit for ${school.name}. ${profileCtx}`);
      setAnalysis(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch { setAnalysis({ fitScore: 50, fitVerdict: "Could not analyze. Try again.", admissionChance: "Unknown", reasoning: "", tips: [] }); }
    finally { setLoading(false); }
  }

  const chanceColor = c => c === "Safety" ? COLORS.teal : c === "Match" ? "#f59e0b" : "#ef4444";

  return (
    <div>
      <h2 style={S.sectionTitle}>School Research</h2>
      <p style={S.sectionSub}>{profile.lsat ? `Using your profile (LSAT ${profile.lsat}, GPA ${profile.gpa}) for personalized analysis.` : "Add your profile in the AI Assistant tab for personalized fit analysis."}</p>

      <input
        placeholder="Search by school name or state (e.g. 'Texas', 'New York', 'Harvard')..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ ...S.input, fontSize: 15, padding: "12px 16px", marginBottom: 20, borderRadius: 12 }}
      />
      <p style={{ fontSize: 12, color: COLORS.light, fontFamily: "DM Sans", marginBottom: 16 }}>{filtered.length} schools found</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {filtered.slice(0, 50).map((school, i) => (
          <div key={i} onClick={() => analyze(school)} style={{ ...S.card, cursor: "pointer", borderColor: selected?.name === school.name ? COLORS.teal : COLORS.border, background: selected?.name === school.name ? COLORS.tealBg : COLORS.white, transition: "all 0.2s" }}>
            <div style={{ fontFamily: "Libre Baskerville", fontWeight: 700, fontSize: 14, color: COLORS.text, marginBottom: 4 }}>{school.name}</div>
            <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "DM Sans", marginBottom: 10 }}>{school.location}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
              {[["LSAT", school.medianLSAT], ["GPA", school.medianGPA], ["Accept", school.acceptRate]].map(([k, v]) => (
                <div key={k} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.teal, fontFamily: "Libre Baskerville" }}>{v}</div>
                  <div style={{ fontSize: 10, color: COLORS.light, fontFamily: "DM Sans", textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 11, color: COLORS.muted, fontFamily: "DM Sans", lineHeight: 1.5 }}>{school.vibe}</p>
          </div>
        ))}
      </div>
      {filtered.length > 50 && <p style={{ textAlign: "center", color: COLORS.muted, fontFamily: "DM Sans", fontSize: 13, marginTop: 16 }}>Showing 50 of {filtered.length} results. Narrow your search to see more.</p>}

      {selected && (
        <div style={{ marginTop: 24, ...S.card, borderLeft: `4px solid ${COLORS.teal}` }}>
          <h3 style={{ fontFamily: "Libre Baskerville", fontSize: 18, margin: "0 0 16px", color: COLORS.text }}>{selected.name} — Fit Analysis</h3>
          {loading ? <div style={{ textAlign: "center", padding: "24px 0" }}><div style={S.spinner} /></div> : analysis && (
            <>
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 40, fontWeight: 700, color: COLORS.teal, fontFamily: "Libre Baskerville" }}>{analysis.fitScore}</div>
                  <div style={{ fontSize: 11, color: COLORS.light, fontFamily: "DM Sans" }}>Fit Score</div>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 20, background: chanceColor(analysis.admissionChance) + "22", color: chanceColor(analysis.admissionChance), fontSize: 13, fontFamily: "DM Sans", fontWeight: 600, marginBottom: 8 }}>{analysis.admissionChance}</span>
                  <p style={{ margin: 0, fontSize: 14, color: COLORS.text, fontFamily: "DM Sans", lineHeight: 1.6 }}>{analysis.fitVerdict}</p>
                </div>
              </div>
              <p style={{ fontSize: 14, color: COLORS.muted, fontFamily: "DM Sans", lineHeight: 1.65, marginBottom: 16 }}>{analysis.reasoning}</p>
              {analysis.tips.length > 0 && (
                <div style={{ background: COLORS.tealBg, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontSize: 11, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 1, fontFamily: "DM Sans", marginBottom: 10 }}>Tips for This School</div>
                  {analysis.tips.map((t, i) => <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6, fontSize: 13, color: COLORS.text, fontFamily: "DM Sans", lineHeight: 1.5 }}><span style={{ color: COLORS.teal, flexShrink: 0 }}>→</span>{t}</div>)}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Application Tracker ─────────────────────────────────────────────
function AppTracker() {
  const [apps, setApps] = useState([
    { id: 1, school: "Yale Law School", deadline: "2025-02-15", status: "In Progress", notes: "Working on personal statement" },
    { id: 2, school: "UT Law", deadline: "2025-03-01", status: "Not Started", notes: "" },
  ]);
  const [adding, setAdding] = useState(false);
  const [newApp, setNewApp] = useState({ school: "", deadline: "", status: "Not Started", notes: "" });
  const [schoolSearch, setSchoolSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const statusColors = { "Not Started": "#94a3b8", "In Progress": "#f59e0b", "Submitted": COLORS.teal, "Accepted": "#059669", "Rejected": "#ef4444", "Waitlisted": "#8b5cf6" };
  const statuses = Object.keys(statusColors);

  const schoolSuggestions = ALL_SCHOOLS.filter(s =>
    schoolSearch.length > 1 && s.name.toLowerCase().includes(schoolSearch.toLowerCase())
  ).slice(0, 6);

  function addApp() {
    if (!newApp.school) return;
    setApps(prev => [...prev, { ...newApp, id: Date.now() }]);
    setNewApp({ school: "", deadline: "", status: "Not Started", notes: "" });
    setSchoolSearch("");
    setAdding(false);
  }

  return (
    <div>
      <h2 style={S.sectionTitle}>Application Tracker</h2>
      <p style={S.sectionSub}>Track every school, deadline, and status in one place.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 12, marginBottom: 24 }}>
        {[["Total", apps.length, COLORS.teal], ["In Progress", apps.filter(a => a.status === "In Progress").length, "#f59e0b"], ["Submitted", apps.filter(a => a.status === "Submitted").length, COLORS.teal], ["Accepted", apps.filter(a => a.status === "Accepted").length, "#059669"]].map(([label, count, color]) => (
          <div key={label} style={{ ...S.card, textAlign: "center", padding: "16px 12px" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "Libre Baskerville" }}>{count}</div>
            <div style={{ fontSize: 11, color: COLORS.muted, fontFamily: "DM Sans", textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {apps.map(app => (
          <div key={app.id} style={{ ...S.card, display: "flex", gap: 16, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontFamily: "Libre Baskerville", fontWeight: 700, fontSize: 15, color: COLORS.text, marginBottom: 4 }}>{app.school}</div>
              {app.deadline && <div style={{ fontSize: 12, color: COLORS.muted, fontFamily: "DM Sans", marginBottom: 4 }}>Deadline: {app.deadline}</div>}
              {app.notes && <div style={{ fontSize: 13, color: COLORS.muted, fontFamily: "DM Sans", fontStyle: "italic" }}>{app.notes}</div>}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <select value={app.status} onChange={e => setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: e.target.value } : a))}
                style={{ padding: "6px 10px", borderRadius: 8, border: `1px solid ${statusColors[app.status]}`, color: statusColors[app.status], fontFamily: "DM Sans", fontSize: 13, background: statusColors[app.status] + "11", cursor: "pointer", outline: "none" }}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => setApps(prev => prev.filter(a => a.id !== app.id))} style={{ background: "none", border: "none", color: COLORS.light, cursor: "pointer", fontSize: 18, padding: "0 4px" }}>×</button>
            </div>
          </div>
        ))}
      </div>
      {adding ? (
        <div style={{ ...S.card, marginTop: 16 }}>
          <div style={S.label}>Add Application</div>
          <div style={{ position: "relative" }}>
            <input placeholder="Search for a school..." value={schoolSearch}
              onChange={e => { setSchoolSearch(e.target.value); setNewApp(p => ({ ...p, school: e.target.value })); setShowDropdown(true); }}
              style={S.input} />
            {showDropdown && schoolSuggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: 10, zIndex: 50, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                {schoolSuggestions.map((s, i) => (
                  <div key={i} onClick={() => { setNewApp(p => ({ ...p, school: s.name })); setSchoolSearch(s.name); setShowDropdown(false); }}
                    style={{ padding: "10px 14px", cursor: "pointer", fontFamily: "DM Sans", fontSize: 13, color: COLORS.text, borderBottom: i < schoolSuggestions.length - 1 ? `1px solid ${COLORS.border}` : "none" }}
                    onMouseEnter={e => e.target.style.background = COLORS.tealBg}
                    onMouseLeave={e => e.target.style.background = "transparent"}>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: COLORS.muted }}>{s.location}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input type="date" value={newApp.deadline} onChange={e => setNewApp(p => ({ ...p, deadline: e.target.value }))} style={S.input} />
          <input placeholder="Notes (optional)" value={newApp.notes} onChange={e => setNewApp(p => ({ ...p, notes: e.target.value }))} style={S.input} />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button onClick={addApp} style={S.btn}>Add School</button>
            <button onClick={() => { setAdding(false); setSchoolSearch(""); }} style={S.btnOutline}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{ ...S.btnOutline, width: "100%", marginTop: 16 }}>+ Add School</button>
      )}
    </div>
  );
}

// ─── AI Assistant ─────────────────────────────────────────────────────
function AIAssistant({ profile, setProfile }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Hi! I'm your LawPath advisor. I can help with personal statements, school selection, resume tips, and anything else about the law school application process. What's on your mind?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const bottomRef = useRef(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    const updated = [...messages, { role: "user", content: userMsg }];
    setMessages(updated);
    setLoading(true);
    try {
      const profileCtx = profile.lsat ? `User profile: LSAT ${profile.lsat}, GPA ${profile.gpa}, Background: ${profile.background || "not specified"}, Target schools: ${profile.targetSchools || "not specified"}.` : "";
      const sys = `You are LawPath, an expert law school admissions advisor. Help with personal statements, school selection, resumes, timelines, and application strategy. Be direct, specific, and encouraging. ${profileCtx}`;
      const text = await callClaude(sys, "", updated.map(m => ({ role: m.role, content: m.content })));
      setMessages(prev => [...prev, { role: "assistant", content: text }]);
    } catch { setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I ran into an error. Please try again." }]); }
    finally { setLoading(false); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div><h2 style={{ ...S.sectionTitle, marginBottom: 4 }}>AI Assistant</h2><p style={S.sectionSub}>Your personal law school admissions advisor.</p></div>
        <button onClick={() => setShowProfile(p => !p)} style={S.btnOutline}>{showProfile ? "Hide Profile" : "My Profile"}</button>
      </div>
      {showProfile && (
        <div style={{ ...S.card, marginBottom: 16, background: COLORS.tealBg, borderColor: COLORS.tealMid }}>
          <div style={S.label}>Your Profile <span style={{ color: COLORS.muted, fontSize: 11, fontWeight: 400 }}>(personalizes advice across all features)</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            {[["LSAT Score", "lsat", "173"], ["GPA", "gpa", "3.85"], ["Target Schools", "targetSchools", "Yale, UT Law"], ["Background", "background", "Economics, pre-law"]].map(([label, key, ph]) => (
              <div key={key}><div style={{ fontSize: 11, color: COLORS.muted, fontFamily: "DM Sans", marginBottom: 4 }}>{label}</div>
                <input placeholder={ph} value={profile[key] || ""} onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))} style={{ ...S.input, marginBottom: 0 }} /></div>
            ))}
          </div>
        </div>
      )}
      <div style={{ background: COLORS.offWhite, borderRadius: 14, border: `1px solid ${COLORS.border}`, height: 380, overflowY: "auto", padding: 16, marginBottom: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
            <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? COLORS.teal : COLORS.white, color: m.role === "user" ? COLORS.white : COLORS.text, fontSize: 14, fontFamily: "DM Sans", lineHeight: 1.6, border: m.role === "assistant" ? `1px solid ${COLORS.border}` : "none", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 12 }}><div style={{ background: COLORS.white, border: `1px solid ${COLORS.border}`, borderRadius: "14px 14px 14px 4px", padding: "10px 16px" }}><div style={{ display: "flex", gap: 4 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.teal, animation: `bounce 1s ${i * 0.2}s infinite` }} />)}</div></div></div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ask anything about law school applications..." style={{ ...S.input, flex: 1, marginBottom: 0 }} />
        <button onClick={send} disabled={loading} style={{ ...S.btn, padding: "10px 20px", flexShrink: 0 }}>Send</button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState(0);
  const [profile, setProfile] = useState({});

  return (
    <div style={{ minHeight: "100vh", background: COLORS.white, fontFamily: "DM Sans, sans-serif" }}>
      <style>{`
        ${FONTS}
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-6px); } }
        ::-webkit-scrollbar { width:6px; } ::-webkit-scrollbar-track { background:#f1f5f9; } ::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:3px; }
        input::placeholder, textarea::placeholder { color:#94a3b8; }
        button:hover { opacity:0.9; }
      `}</style>
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 0" }}>
            <div style={{ width: 34, height: 34, background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚖️</div>
            <span style={{ fontFamily: "Libre Baskerville", fontSize: 20, fontWeight: 700, color: COLORS.text, letterSpacing: "-0.5px" }}>LawPath</span>
          </div>
          <nav style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {NAV_ITEMS.map((item, i) => (
              <button key={i} onClick={() => setTab(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "DM Sans", fontSize: 13, fontWeight: 500, background: tab === i ? COLORS.tealBg : "transparent", color: tab === i ? COLORS.teal : COLORS.muted, transition: "all 0.15s" }}>{item}</button>
            ))}
          </nav>
        </div>
      </div>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.teal}, ${COLORS.tealDark})`, padding: "40px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "Libre Baskerville", fontSize: "clamp(24px,4vw,38px)", color: COLORS.white, margin: "0 0 10px", fontWeight: 700, letterSpacing: "-0.5px" }}>Your law school journey,<br />guided by AI.</h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, margin: 0, fontFamily: "DM Sans" }}>Personal statement review · School research · Application tracking · AI advising</p>
        </div>
      </div>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 80px" }}>
        <div style={{ animation: "fadeUp 0.35s ease" }} key={tab}>
          {tab === 0 && <StatementReview />}
          {tab === 1 && <SchoolResearch profile={profile} />}
          {tab === 2 && <AppTracker />}
          {tab === 3 && <AIAssistant profile={profile} setProfile={setProfile} />}
        </div>
      </div>
    </div>
  );
}

const S = {
  sectionTitle: { fontFamily: "Libre Baskerville", fontSize: 24, fontWeight: 700, color: "#0f172a", margin: "0 0 6px", letterSpacing: "-0.5px" },
  sectionSub: { fontFamily: "DM Sans", fontSize: 14, color: "#64748b", margin: "0 0 24px" },
  card: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  label: { fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, fontFamily: "DM Sans", fontWeight: 600 },
  btn: { background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans" },
  btnOutline: { background: "transparent", color: "#0d9488", border: "1px solid #0d9488", borderRadius: 10, padding: "10px 20px", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "DM Sans" },
  input: { width: "100%", padding: "10px 12px", border: "1px solid #e2e8f0", borderRadius: 10, fontSize: 14, fontFamily: "DM Sans", color: "#0f172a", outline: "none", background: "#f8fafc", marginBottom: 10 },
  spinner: { width: 32, height: 32, border: "3px solid #e2e8f0", borderTop: "3px solid #0d9488", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" },
};

