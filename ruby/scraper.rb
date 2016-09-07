require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'openssl'
require 'mongo'


OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE



class String
  def between marker1, marker2
    self[/#{Regexp.escape(marker1)}(.*?)#{Regexp.escape(marker2)}/m, 1]
  end
end

class Scrape
  def scrape zip, proxy
    @scrapeLink = ['//www.gofundme.com/', '?ssid']
    @scrapeName = ['>by ', '</']
    @scrapeRaised = ['>$', ' raised'] #Add a few more currency symbols
    @scrapeRaisedPound = ['>£', ' raised']
    @scrapeLocation = ['uppercase;">', '</a']
    @scrapeTitle = ['title="Visit ','"']
    @noResults = ['<div class="nores">','</div>']

    client = Mongo::Client.new(['127.0.0.1:27017'], :database => 'gofundme')
    db = client.database
    @fundraisers = db.collection('fundraisers')

    $zip = zip
    $proxy = proxy
    # URL SAMPLE # url = 'https://www.gofundme.com/mvc.php?route=search&page=2&term=76134'
    # ERROR LOG CHECKING # puts "THIS IS THE PROBLEM! ----------- #{PROBLEM} PAGE #{$k} ZIPCODE #{$zip}"
    # BODY PRINTER         File.open('../ruby/logs.txt', 'w') { |file| file.write(log) }

    $k = 0
    while $k < 50 do

      url = "https://www.gofundme.com/Medical-Illness-Healing?page=#{$k+1}&term=#{$zip}"
      @doc = Nokogiri::HTML(open(url, :proxy => $proxy))
        temp = @doc.to_s
        noResults = temp.between(@noResults[0],@noResults[1])
        break if noResults == 'No results found'
        File.open('../ruby/body.html', 'w') { |file| file.write(@doc) }
      $i = 0
      while $i < 10 do
        body = @doc.xpath("//div[5]//div[2]//div[#{$i+3}]//div[2]").to_s #i+3
        puts "THIS IS THE BODY --------------------- --"

        #SCRAPE TITLE
        title = body.between(@scrapeTitle[0], @scrapeTitle[1])
        title = "N/A" if title == nil

        #SCRAPE NAME
        res_name = body.between(@scrapeName[0], @scrapeName[1])
        res_name = 'N/A N/A' if res_name == nil
        name = res_name.split(' ') if res_name != nil
        name[1] = name[2] if name[2]

        #SCRAPE LINK
        unique_link = body.between(@scrapeLink[0], @scrapeLink[1])
        unique_link = unique_link.tr('?','') if unique_link != nil
        unique_link = 'N/A' if unique_link == nil
        link = "https://www.gofundme.com/#{unique_link}"

        #SCRAPE MONEY
        res_money = body.between(@scrapeRaised[0],@scrapeRaised[1])
        res_money = body.between(@scrapeRaisedPound[0],@scrapeRaisedPound[1]) if res_money == nil
        res_money = 'N/,A' if res_money == nil
        res_money = 'N/,A' if res_money.length > 7
        res_money = res_money.tr(',','') if res_money.include?(',') == true
        money = Integer(res_money) if res_money != 'N/A'
        money = res_money if res_money == 'N/A'
        money = nil if res_money == nil

        #SCRAPE LOCATION
        res_location = body.between(@scrapeLocation[0],@scrapeLocation[1])
        res_location = res_location.split(', ') if res_location != nil
        res_location = 'N/A, N/A' if res_location == nil
        city = res_location[0]
        state = res_location[1]

        #TIMESTAMP DATE
        time = Time.now

        #MONGO CLIENT
        new_obj = {:firstname => name[0],
                   :lastname => name[1],
                   :title => title,
                   :money => money,
                   :city => city,
                   :state => state,
                   :unique_link => unique_link,
                   :link => link,
                   :last_updated => time}
        #puts new_obj



        test = @fundraisers.find(:unique_link => unique_link).first #try second for data
        #puts test
        test[:money] = money if test
        @fundraisers.update_one({:unique_link => unique_link}, test) if test
        @fundraisers.insert_one(new_obj) if test == nil

        log = "LAST COMPLETION: Time #{time} || Zipcode #{$zip} || Page #{$k+1} || Campaign #{link} || SearchLink https://www.gofundme.com/Medical-Illness-Healing?page=#{$k+1}&term=#{$zip} "
        File.open('../ruby/logs.txt', 'w') { |file| file.write(log) }
        puts 'LOGGED'

        $i +=1
      end
      $k+=1
    end
  end
end

#/html/body/div[5]/div[2]/div[5]/div[2]
#///////////////////////////////////////////////////////////////////////////////
@proxylist = ["http://97.77.104.22:80"]
$scrape = Scrape.new

$px = 0
$zipcount = 1
@continue = false

zipcodes = ["00401", "00501", "01001", "01101", "01201", "01301", "01401", "01501", "01601", "01701", "01801", "01901", "02001", "02101", "02201", "02301", "02401", "02501", "02601", "02701", "02801", "02901", "03001", "03101", "03201", "03301", "03401", "03501", "03601", "03701", "03801", "03901", "04001", "04101", "04201", "04301", "04401", "04501", "04601", "04701", "04801", "04901", "05001", "05101", "05201", "05301", "05401", "05501", "05601", "05701", "05801", "05901", "06001", "06101", "06201", "06301", "06401", "06501", "06601", "06701", "06801", "06901", "07001", "07101", "07201", "07301", "07401", "07501", "07601", "07701", "07801", "07901", "08001", "08101", "08201", "08301", "08401", "08501", "08601", "08701", "08801", "08901", "10001", "10101", "10201", "10301", "10401", "10501", "10601", "10701", "10801", "10901", "11001", "11101", "11201", "11301", "11401", "11501", "11601", "11701", "11801", "11901", "12001", "12101", "12201", "12301", "12401", "12501", "12601", "12701", "12801", "12901", "13001", "13101", "13201", "13301", "13401", "13501", "13601", "13701", "13801", "13901", "14001", "14101", "14201", "14301", "14401", "14501", "14601", "14701", "14801", "14901", "15001", "15101", "15201", "15301", "15401", "15501", "15601", "15701", "15801", "15901", "16001", "16101", "16201", "16301", "16401", "16501", "16601", "16701", "16801", "16901", "17001", "17101", "17201", "17301", "17401", "17501", "17601", "17701", "17801", "17901", "18001", "18101", "18201", "18301", "18401", "18501", "18601", "18701", "18801", "18901", "19001", "19101", "19201", "19301", "19401", "19501", "19601", "19701", "19801", "19901", "20001", "20101", "20201", "20301", "20401", "20501", "20601", "20701", "20801", "20901", "21001", "21101", "21201", "21401", "21501", "21601", "21701", "21801", "21901", "22001", "22101", "22201", "22301", "22401", "22501", "22601", "22701", "22801", "22901", "23001", "23101", "23201", "23301", "23401", "23501", "23601", "23701", "23801", "23901", "24001", "24101", "24201", "24301", "24401", "24501", "24601", "24701", "24801", "24901", "25001", "25101", "25201", "25301", "25401", "25501", "25601", "25701", "25801", "25901", "26001", "26101", "26201", "26301", "26401", "26501", "26601", "26701", "26801", "27001", "27101", "27201", "27301", "27401", "27501", "27601", "27701", "27801", "27901", "28001", "28101", "28201", "28301", "28401", "28501", "28601", "28701", "28801", "28901", "29001", "29101", "29201", "29301", "29401", "29501", "29601", "29701", "29801", "29901", "30001", "30101", "30201", "30301", "30401", "30501", "30601", "30701", "30801", "30901", "31001", "31101", "31201", "31301", "31401", "31501", "31601", "31701", "31801", "31901", "32001", "32101", "32201", "32301", "32401", "32501", "32601", "32701", "32801", "32901", "33001", "33101", "33201", "33301", "33401", "33501", "33601", "33701", "33801", "33901", "34001", "34101", "34201", "34401", "34601", "34701", "34901", "35001", "35101", "35201", "35401", "35501", "35601", "35701", "35801", "35901", "36001", "36101", "36201", "36301", "36401", "36501", "36601", "36701", "36801", "36901", "37001", "37101", "37201", "37301", "37401", "37501", "37601", "37701", "37801", "37901", "38001", "38101", "38201", "38301", "38401", "38501", "38601", "38701", "38801", "38901", "39001", "39101", "39201", "39301", "39401", "39501", "39601", "39701", "39801", "39901", "40001", "40101", "40201", "40301", "40401", "40501", "40601", "40701", "40801", "40901", "41001", "41101", "41201", "41301", "41401", "41501", "41601", "41701", "41801", "41901", "42001", "42101", "42201", "42301", "42401", "42501",
  "42601", "42701", "43001", "43101", "43201", "43301", "43401", "43501", "43601", "43701", "43801", "43901", "44001", "44101", "44201", "44301", "44401", "44501", "44601", "44701", "44801", "44901", "45001", "45101", "45201", "45301", "45401", "45501", "45601", "45701", "45801", "45901", "46001", "46101", "46201", "46301", "46401", "46501", "46601", "46701", "46801", "46901", "47001", "47101", "47201", "47301", "47401", "47501", "47601", "47701", "47801", "47901", "48001", "48101", "48201", "48301", "48401", "48501", "48601", "48701", "48801", "48901", "49001", "49101", "49201", "49301", "49401", "49501", "49601", "49701", "49801", "49901", "50001", "50101", "50201", "50301", "50401", "50501", "50601", "50701", "50801", "50901", "51001", "51101", "51201", "51301", "51401", "51501", "51601", "52001", "52101", "52201", "52301", "52401", "52501", "52601", "52701", "52801", "53001", "53101", "53201", "53401", "53501", "53701", "53801", "53901", "54001", "54101", "54201", "54301", "54401", "54501", "54601", "54701", "54801", "54901", "55001", "55101", "55301", "55401", "55501", "55601", "55701", "55801", "55901", "56001", "56101", "56201", "56301", "56401", "56501", "56601", "56701", "56901", "57001", "57101", "57201", "57301", "57401", "57501", "57601", "57701", "58001", "58101", "58201", "58301", "58401", "58501", "58601", "58701", "58801", "59001", "59101", "59201", "59301", "59401", "59501", "59601", "59701", "59801", "59901", "60001", "60101", "60201", "60301", "60401", "60501", "60601", "60701", "60801", "60901", "61001", "61101", "61201", "61301", "61401", "61501", "61601", "61701", "61801", "61901", "62001", "62201", "62301", "62401", "62501", "62601", "62701", "62801", "62901", "63001", "63101", "63301", "63401", "63501", "63601", "63701", "63801", "63901", "64001", "64101", "64401", "64501", "64601", "64701", "64801", "64901", "65001", "65101", "65201", "65301", "65401", "65501", "65601", "65701", "65801", "66001", "66101", "66201", "66401", "66501", "66601", "66701", "66801", "66901", "67001", "67101", "67201", "67301", "67401", "67501", "67601", "67701", "67801", "67901", "68001", "68101", "68301", "68401", "68501", "68601", "68701", "68801", "68901", "69001", "69101", "69201", "69301", "70001", "70101", "70301", "70401", "70501", "70601", "70701", "70801", "71001", "71101", "71201", "71301", "71401", "71601", "71701", "71801", "71901", "72001", "72101", "72201", "72301", "72401", "72501", "72601", "72701", "72801", "72901", "73001", "73101", "73301", "73401", "73501", "73601", "73701", "73801", "73901", "74001", "74101", "74301", "74401", "74501", "74601", "74701", "74801", "74901", "75001", "75101", "75201", "75301", "75401", "75501", "75601", "75701", "75801", "75901", "76001", "76101", "76201", "76301", "76401", "76501", "76601", "76701", "76801", "76901", "77001", "77201", "77301", "77401", "77501", "77601", "77701", "77801", "77901", "78001", "78101", "78201", "78301", "78401", "78501", "78601", "78701", "78801", "78901", "79001", "79101", "79201", "79301", "79401", "79501", "79601", "79701", "79801", "79901", "80001", "80101", "80201", "80301", "80401", "80501", "80601", "80701", "80801", "80901", "81001", "81101", "81201", "81301", "81401", "81501", "81601", "82001", "82101", "82201", "82301", "82401", "82501", "82601", "82701", "82801", "82901", "83001", "83101", "83201", "83301", "83401", "83501", "83601", "83701", "83801", "84001", "84101", "84201", "84301", "84401", "84501", "84601", "84701", "85001", "85101", "85201", "85301", "85501", "85601", "85701", "85901", "86001", "86301", "86401", "86501", "87001", "87101", "87201", "87301", "87401", "87501", "87701", "87801",
  "87901", "88001", "88101", "88201", "88301", "88401", "88501", "88901", "89001", "89101", "89301", "89401", "89501", "89701", "89801", "90001", "90101", "90201", "90301", "90401", "90501", "90601", "90701", "90801", "91001", "91101", "91201", "91301", "91401", "91501", "91601", "91701", "91801", "91901", "92001", "92101", "92201", "92301", "92401", "92501", "92601", "92701", "92801", "93001", "93101", "93201", "93301", "93401", "93501", "93601", "93701", "93801", "93901", "94001", "94101", "94201", "94301", "94401", "94501", "94601", "94701", "94801", "94901", "95001", "95101", "95201", "95301", "95401", "95501", "95601", "95701", "95801", "95901", "96001", "96101", "96201", "96301", "96501", "96601", "96701", "96801", "96901", "97001", "97101", "97201", "97301", "97401", "97501", "97601", "97701", "97801", "97901", "98001", "98101", "98201", "98301", "98401", "98501", "98601", "98801", "98901", "99001", "99101", "99201", "99301", "99401", "99501", "99601", "99701", "99801", "99901"];

zipcodes.each do |zip|


  if ($zipcount == 92 or $zipcount == 184 or $zipcount == 276 or $zipcount == 368 or $zipcount == 460 or
      $zipcount == 552 or $zipcount == 644 or $zipcount == 736 or $zipcount == 828 or $zipcount == 920)
      $px+=1
  end

  $zip = zip
  #puts zip
  #JUMP TO  break if (Integer($zip) < 04401) #PROPOSED_ZIP))

  @continue = true if zip == '96001'

  proxy = @proxylist[$px]

  puts "////////////////////////////////////////"
  puts "ZIPCODE NUMBER--------------------#{zip}"
  puts "////////////////////////////////////////"
  $scrape.scrape $zip, proxy if @continue
    #puts "#{zip} - #{pr0xy} - #{$zipcount}"

  #puts $proxy
  #puts $zip
  $zipcount +=1
end
