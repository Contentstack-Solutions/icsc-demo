import { useState } from "react";
import Image from "next/image";
import { XMarkIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useEntity } from "@/context/lyticsTracking";
import { JsonViewer } from '@textea/json-viewer';

export default function LyticsExtension({ onClose }) {
  const [statsOpen, setStatsOpen] = useState(true);
  const lyticsProfileData = useEntity();
  const [selectedTab, setSelectedTab] = useState("Summary");

  function moveDecimalPoint(num) {
    if (num >= 1) return "100";
    const str = num.toString();
    const decimalIndex = str.indexOf(".");
    return str.slice(decimalIndex + 1, decimalIndex + 3);
  }

  function addCommas(numStr) {
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <div>
    <div
        className={`top-0 bottom-0 flex flex-col shadow-xl md:w-[480px] bg-white z-50 duration-200 ease-in-out m-2 fixed rounded-2xl text-black overflow-y-auto ${statsOpen ? "md:right-0 md:left-auto left-0 right-0" : "hidden"}`}
      >
        <div className="flex justify-between items-end bg-[#404040] py-1 px-2">
          <div className="p-2 mx-1 flex">
            <Image
              alt="Contentstack"
              className="h-[20px] w-auto"
              src="https://images.contentstack.io/v3/assets/blt7359e2a55efae483/blt0b9a8281aeac3ec0/664c27d3c9024c35b5ad593a/CS_logo.png"
              width={80}
              height={20}
            />
            <div className="font-medium text-[15px] text-neutral-100 normal-case mx-2 self-center h-full ">
              Contentstack Dev Tools
            </div>
          </div>
          <button
            className="cursor-pointer ms-auto text-white"
            type="button"
            onClick={() => { setStatsOpen(false); onClose?.(); }}
          >
            <XMarkIcon className="h-8 m-1 p-1" />
          </button>
        </div>

      
          <div className="h-full w-full rounded-b-xl mb-2 bg-white flex flex-col">

          {!lyticsProfileData ? (
            <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3 text-neutral-500">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-200 border-t-[#6351e3]" />
              <span className="text-sm">Loading profile…</span>
            </div>
          ) : (<>

          <div className="h-[50px] flex grid-cols-3 border-b-[1px] border-neutral-200 font-roboto text-[14px] font-semibold tracking-wide">
            <div
              className={`flex items-center py-4 px-8 ${selectedTab === "Summary" ? 'border-b-[#6351e3] text-[#6351e3]' : 'text-[#ababab] border-b-transparent'} border-b-[3px] cursor-pointer`}
              onClick={() => setSelectedTab("Summary")}
            >
              Summary
            </div>
            <div
              className={`flex items-center py-4 px-8 ${selectedTab === "All Attributes" ? 'border-b-[#6351e3] text-[#6351e3]' : 'text-[#ababab] border-b-transparent'} border-b-[3px] cursor-pointer`}
              onClick={() => (setSelectedTab("All Attributes"))}
            >
              Attributes ({lyticsProfileData &&
                      Object.keys(lyticsProfileData?.data?.user).length
                    })
            </div>
            {/* <div
              className={`flex items-center py-4 px-8 ${selectedTab === "Customer" ? 'border-b-[#6351e3] text-[#6351e3]' : 'text-[#ababab] border-b-transparent'} border-b-[3px] cursor-pointer`}
              onClick={() => (lyticsProfileData?.data?.user?.email ? setSelectedTab("Customer") : '')}
            >
              Customer
            </div> */}
          </div>

          <div className="px-2">
            <div className={`${selectedTab === "Summary" ? "" : "hidden"}`}>
              <div className="h-[90%] border-lg pt-1 pb-2 px-4 rounded-md">
                

                <div className="border-b-[1px] border-neutral-200 flex items-center justify-between mx-2 py-2">
                  <div className="text-[14px] font-semibold normal-case mr-12 py-2">
                    Lytics ID
                  </div>
                  <div className="text-[12px] font-medium justify-self-end normal-case">
                    {lyticsProfileData?.data?.user?._id}
                  </div>
                </div>

                {lyticsProfileData?.data?.user?._uid &&
                  <div className="border-b-[1px] border-neutral-200 flex items-center justify-between mx-2 py-2">
                    <div className="text-[14px] font-semibold normal-case mr-8 py-2">
                      Last _UID
                      (Cookie)
                    </div>
                    <div className="text-[12px] font-medium justify-self-end normal-case">
                      {lyticsProfileData?.data?.user?._uid}
                    </div>
                  </div>
                }


                <div className="border-b-[1px] border-neutral-200 flex flex-col justify-between m-2 py-2">
                  <div className="text-[14px] font-semibold normal-case ">
                    Audiences
                  </div>
                  <div className="text-[14px] normal-case flex flex-row flex-wrap justify-center">
                    {lyticsProfileData?.data?.user?.segments?.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="border-[1px] text-[12px]  border-neutral-400 rounded-lg bg-white p-1 m-1 max-w-[80%] truncate"
                        >
                          {item}
                        </div>
                      )
                    )}
                  </div>
                </div>
               {lyticsProfileData?.data?.user?.segment_prediction && (
                <div className="border-b-[1px] border-neutral-200 flex flex-col justify-between m-2 py-3">
                  <div className="text-[14px] font-semibold normal-case mb-2">
                    Lookalike Models
                  </div>

                  <div className="flex justify-center flex-col">
                      {Object.keys(lyticsProfileData?.data?.user?.segment_prediction).map((item, index) => (
                      <div key={index} className="flex flex-row normal-case text-[12px] justify-end my-1">
                          <div className="mr-4 w-[35%] truncate">{item}</div>
                          <div className="mr-2 text-end w-[6%]">{moveDecimalPoint(lyticsProfileData?.data?.user?.segment_prediction[item]
                          )}</div>
                          <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                            <div
                              className={`absolute top-0 left-0 bg-gradient-to-r from-[#f6b25e] to-amber-600 rounded-sm h-full  border-r-black`}
                              style={{
                                width:
                                  moveDecimalPoint(lyticsProfileData?.data?.user?.segment_prediction[item]) +
                                  "%",
                              }}More actions
                            ></div>
                          </div>
                        </div>
                        )
                      )}
                  </div>
                </div>
                )}

                <div className="border-b-[1px] border-neutral-200 flex flex-col justify-between m-2 py-3">
                  <div className="text-[14px] font-semibold normal-case mb-2">
                    Behavioral Scores
                  </div>

                  <div className="flex justify-center flex-col">
                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Consistency</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_consistency}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_consistency +
                              "%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Frequency</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_frequency}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_frequency +
                              "%",
                          }}
                        >
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Intensity</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_intensity}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_intensity +
                              "%",
                          }}
                        >
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Maturity</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_maturity}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_maturity + "%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Momentum</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_momentum}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_momentum + "%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Propensity</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_propensity}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_propensity +
                              "%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Quantity</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_quantity}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`"absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width: `${lyticsProfileData?.data?.user?.score_quantity}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Recency</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_recency}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_recency + "%",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                      <div className="mr-4 w-[35%]">Volatility</div>
                      <div className="mr-1 w-[6%] text-end">{lyticsProfileData?.data?.user?.score_volatility}</div>
                      <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                        <div
                          className={`absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full`}
                          style={{
                            width:
                              lyticsProfileData?.data?.user?.score_volatility +
                              "%",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-neutral-200 flex flex-col justify-between m-2 py-2">
                  <div className="text-[14px] font-semibold normal-case my-2">
                    Interests
                  </div>

                  <div className="flex justify-center flex-col">
                    {lyticsProfileData?.data?.user.luxury_likelihood ?
                    <div className="flex flex-row normal-case text-[12px] justify-end my-1">
                          <div className="mr-4 w-[35%] truncate">Luxury</div>
                          <div className="mr-2 text-end w-[6%]">{lyticsProfileData?.data?.user?.luxury_likelihood}</div>
                          <div className="w-[60%] bg-[#d9d9e1] rounded-md border-[1px] border-neutral-100 relative">
                            <div className="absolute top-0 left-0 bg-gradient-to-r from-[#6351e3] to-[#b247f8] rounded-sm h-full"
                            style={{
                              width:
                                lyticsProfileData?.data?.user?.luxury_likelihood +
                                "%",
                            }}>
                            </div>
                          </div>
                        </div>
                       : (
                      <div className="bg-[#f6f5fc] flex flex-col justify-center rounded-lg p-4 items-center">
                        <LockClosedIcon className="h-8 w-8 text-neutral-600" />
                        <div className="text-black text-[14px] font-light normal-case flex justify-center self-center">
                          Browse more content to unlock interests
                          </div>
                    </div>
                    )}
            
                  </div>
                </div>
              </div>
            </div>

            <div className={`${selectedTab === "Customer" ? "" : "hidden"} p-2`}>
              
              <div className="border-b-[1px] border-neutral-200 p-1">
                <p className="text-[14px] font-semibold mt-2">Shopify Total Spend</p>
              </div>

               <div className="flex flex-row normal-case text-[14px] justify-end my-1 mt-5">
                <div className="mr-4 w-[40%] pl-8">Shopify Total Spent</div>
                {lyticsProfileData?.data?.user?.shopify_total_spend &&
                <div className="w-[60%] relative">
                  ${addCommas(lyticsProfileData?.data?.user?.shopify_total_spend)}
                </div>
                }
              </div>
                      
              <div className="border-b-[1px] border-neutral-200 p-1">
                <p className="text-[14px] font-semibold mt-8">Salesforce</p>
              </div>
              
              <div className="flex flex-row normal-case text-[14px] justify-end my-1 mt-5">
                <div className="mr-4 w-[40%] pl-8">Full Name</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_name}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4 w-[40%] pl-8">Phone Number</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_phone}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4 w-[40%] pl-8">Postal Code</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_postal_code}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4 w-[40%] pl-8">Marketing Opt Out</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_has_opted_out_of_email ? "True" : "False"}
                </div>
              </div>

              <div className="flex flex-row normal-case text-[14px] justify-end my-1 mt-5">
                <div className="mr-4 w-[40%] pl-8">Company</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_company}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4 w-[40%] pl-8">Industry</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_industry}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4 w-[40%] pl-8">Number Of Employees</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.salesforce_lead_number_of_employees}
                </div>
              </div>

              <div className="border-b-[1px] border-neutral-200 p-2">
                <p className="text-[14px] font-semibold mt-8">Bookings</p>
              </div>
              
              <div className="flex flex-row normal-case text-[14px] justify-end my-1 mt-5">
                <div className="mr-4  w-[40%] pl-8">Past 12 months</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.lead_booking_count_12m}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4  w-[40%] pl-8">Nights</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.lead_booking_count_nights}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4  w-[40%] pl-8">Lifetime</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.lead_booking_count_lifetime}
                </div>
              </div>
              <div className="flex flex-row normal-case text-[14px] justify-end my-1">
                <div className="mr-4  w-[40%] pl-8">Lifetime Nights</div>
                <div className="w-[60%] relative">
                  {lyticsProfileData?.data?.user?.lead_booking_count_lifetime_nights}  
                </div>
              </div>

            </div>

            <div className={`${selectedTab === "All Attributes" ? "" : "hidden"} p-4`}>
              <JsonViewer value={lyticsProfileData?.data?.user} rootName={"user"} enableClipboard={false} displayDataTypes={false} theme={'light'}/>
            </div>

          </div>
          </>)}
        </div>
      </div>
    </div>
  );
}