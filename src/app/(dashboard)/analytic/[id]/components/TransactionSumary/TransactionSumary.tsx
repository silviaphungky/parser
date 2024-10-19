'use client'

import { Card, LineSeparator, ProgressBar, StackedBarChart } from '@/components'
import AreaChart from '@/components/AreaChart'
import DatePickerRange from '@/components/DatePickerRange'
import InputDropdown from '@/components/InputDropdown'
import { IconIn, IconOut } from '@/icons'
import IconWallet from '@/icons/IconWallet'
import { thousandSeparator } from '@/utils/thousanSeparator'
import TransactionPieChartFreq from '../TransactionPieChartFreq'

const mockBank = [
  {
    id: 'bca',
    label: 'BCA',
  },
  {
    id: 'bni',
    label: 'BNI',
  },
  {
    id: 'mandiri',
    label: 'Mandiri',
  },
]

const mockFreqFilter = [
  {
    id: 'category',
    label: 'Category',
  },
  {
    id: 'subject',
    label: 'Subject',
  },
  {
    id: 'transactionMethod',
    label: 'Transaction Method',
  },
]

const transactionData = {
  balance: {
    total: 899999222,
    avg: 123123,
  },
  in: {
    total: 2330000,
    change: 10000,
    count: 333,
  },
  out: {
    total: 770000,
    change: 99000,
    count: 20,
  },
}

const topTransactionValueData = {
  in: [
    {
      name: 'Michelle',
      nominal: 1899999,
    },
    {
      name: 'Jarwo',
      nominal: 200000,
    },
    {
      name: 'David',
      nominal: 100000,
    },
    {
      name: 'Ilham',
      nominal: 88000,
    },
  ],

  out: [
    {
      name: 'Jodi',
      nominal: 388888,
    },
    {
      name: 'Joko',
      nominal: 80000,
    },
    {
      name: 'Dena',
      nominal: 12000,
    },
    {
      name: 'Dodi',
      nominal: 10000,
    },
  ],
}

const data = [
  {
    name: 'Jan 2024',
    bca: 4000,
    bni: 2400,
    mandiri: 2400,
  },
  {
    name: 'Feb 2024',
    bca: 3000,
    bni: 1398,
    mandiri: 2210,
  },
  {
    name: 'March 2024',
    bca: 2000,
    bni: 9800,
    mandiri: 2290,
  },
  {
    name: 'April 2024',
    bca: 2780,
    bni: 3908,
    mandiri: 2000,
  },
  {
    name: 'May 2024',
    bca: 1890,
    bni: 4800,
    mandiri: 2181,
  },
  {
    name: 'June 2024',
    bca: 2390,
    bni: 3800,
    mandiri: 2500,
  },
  {
    name: 'July 2024',
    bca: 3490,
    bni: 4300,
    mandiri: 2100,
  },
]

const TransactionSumary = () => {
  return (
    <div className="mt-0">
      <div className="mt-4 flex gap-4 justify-end">
        <div className="w-[10rem]">
          <InputDropdown
            value={mockBank[0]}
            options={mockBank}
            onChange={() => {}}
          />
        </div>
        <DatePickerRange />
      </div>

      <div className="flex gap-4">
        <Card className="flex-1">
          <div className="flex gap-2">
            <div className="p-1 bg-[#2767bd80] rounded-lg h-[2.25rem]">
              <IconWallet color="white" size={26} />
            </div>
            <div>
              <div className="text-sm">Balance</div>
              <div className="text-xl font-bold">{`Rp ${thousandSeparator(
                transactionData.balance.total
              )}`}</div>
            </div>
          </div>
          <div className="mt-4">
            <AreaChart
              data={data}
              height={300}
              width={500}
              yLegend="balance"
              xAxis="date"
            />
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex gap-2">
            <div className="p-1 bg-[#77ED8B] rounded-lg h-[2.25rem]">
              <IconIn color="white" size={26} />
            </div>
            <div>
              <div className="text-sm">Transfer In</div>
              <div className="text-xl font-bold">{`Rp ${thousandSeparator(
                transactionData.in.total
              )}`}</div>
              <div className="text-xs">{`#${thousandSeparator(
                transactionData.in.count
              )} transactions`}</div>
            </div>
          </div>
          <LineSeparator />
          <div className="mt-4 font-semibold font-barlow text-lg mb-2">
            Top Value
          </div>
          {topTransactionValueData.in.map((item, index) => {
            return (
              <div key={`topValueIn-${index}`} className="mb-1">
                <div className="flex justify-between">
                  <div>{item.name}</div>
                  <div className="text-sm cursor-pointer text-blue-400">
                    see all
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <ProgressBar
                    progress={(item.nominal / transactionData.in.total) * 100}
                    className="bg-[#22C55E]"
                  />
                  <div className="text-xs text-gray-600">
                    {`${(
                      (item.nominal / transactionData.in.total) *
                      100
                    ).toFixed(0)}%`}
                  </div>
                </div>
                <div className="font-semibold">{`Rp ${thousandSeparator(
                  item.nominal
                )}`}</div>
              </div>
            )
          })}
        </Card>

        <Card className="flex-1">
          <div className="flex gap-2">
            <div className="p-1 bg-[#fe8c8c] rounded-lg h-[2.25rem]">
              <IconOut color="white" size={26} />
            </div>
            <div>
              <div className="text-sm">Transfer Out</div>
              <div className="text-xl font-bold">{`Rp ${thousandSeparator(
                transactionData.out.total
              )}`}</div>
              <div className="text-xs">{`#${thousandSeparator(
                transactionData.out.count
              )} transactions`}</div>
            </div>
          </div>
          <LineSeparator />
          <div className="mt-4 font-semibold font-barlow mb-2">Top Value</div>
          {topTransactionValueData.out.map((item, index) => {
            return (
              <div key={index} className="mb-1">
                <div className="flex justify-between">
                  <div>{item.name}</div>
                  <div className="text-sm cursor-pointer text-blue-400">
                    see all
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <ProgressBar
                    progress={(item.nominal / transactionData.out.total) * 100}
                    className="bg-[#fe8c8c]"
                  />
                  <div className="text-xs text-gray-600">
                    {`${(
                      (item.nominal / transactionData.in.total) *
                      100
                    ).toFixed(0)}%`}
                  </div>
                </div>

                <div className="font-semibold">{`Rp ${thousandSeparator(
                  item.nominal
                )}`}</div>
              </div>
            )
          })}
        </Card>
      </div>

      {/* category */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Transaction by Frequency</h2>

        <div className="mb-4">
          <Card style={{ flex: '0 0 46%' }}>
            <div className="h-[18rem]">
              <StackedBarChart />
            </div>
          </Card>
        </div>

        <div className="flex gap-4">
          {/* <Card className="flex-1 h-[25rem]">
                <StackedBarChart />
              </Card> */}

          <Card className="flex-1">
            <div className="w-[10rem] mb-6 ml-auto">
              <InputDropdown
                value={mockFreqFilter[0]}
                options={mockFreqFilter}
                onChange={() => {}}
              />
            </div>
            <div className="flex-1 flex gap-2">
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="p-1 bg-[#77ED8B] rounded-lg h-[2.25rem]">
                    <IconIn color="white" size={26} />
                  </div>
                  <div>
                    <div className="text-sm">Transfer In</div>
                    <div className="text-xl font-bold">{`Rp ${thousandSeparator(
                      transactionData.in.total
                    )}`}</div>
                    <div className="text-xs">{`#${thousandSeparator(
                      transactionData.in.count
                    )} transactions`}</div>
                  </div>
                </div>
                <div>
                  <TransactionPieChartFreq />
                </div>
              </div>

              <div className="flex-1">
                {/* pie chart */}
                <div className="flex gap-2">
                  <div className="p-1 bg-[#fe8c8c] rounded-lg h-[2.25rem]">
                    <IconOut color="white" size={26} />
                  </div>
                  <div>
                    <div className="text-sm">Transfer Out</div>
                    <div className="text-xl font-bold">{`Rp ${thousandSeparator(
                      transactionData.out.total
                    )}`}</div>
                    <div className="text-xs">{`#${thousandSeparator(
                      transactionData.out.count
                    )} transactions`}</div>
                  </div>
                </div>
                <div>
                  <TransactionPieChartFreq />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
export default TransactionSumary
