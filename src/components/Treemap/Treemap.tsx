'use client'
import { numberAbbv } from '@/utils/numberAbbv'
import { ResponsiveContainer, Treemap as RTreemap, Tooltip } from 'recharts'

const getColor = (frequency: number, colorScale: Array<string>) => {
  if (frequency > 0.1 && frequency <= 1) {
    return colorScale[0]
  }
  if (frequency > 1 && frequency <= 2) {
    return colorScale[1]
  }
  if (frequency > 2 && frequency <= 4) {
    return colorScale[2]
  }
  if (frequency > 4 && frequency <= 6) {
    return colorScale[3]
  }
  if (frequency > 6 && frequency <= 8) {
    return colorScale[4]
  }
  if (frequency > 8 && frequency <= 10) {
    return colorScale[5]
  }
  if (frequency > 10) return colorScale[6]
}

// Custom rendering cell function
const CustomizedContent = (props: any) => {
  const {
    x,
    y,
    width,
    height,
    colorScale,
    entity_name,
    total_amount,
    total_transaction,
    entity_bank,
    entity_account_number,
  } = props

  return (
    entity_name && (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={getColor(total_transaction, colorScale) || 'white'}
          stroke="white"
        />
        <text
          x={x + 10}
          y={y + 20}
          fontSize="12"
          fontWeight="bold"
          stroke="none"
        >
          {`${entity_name} - ${entity_bank} ${entity_account_number}`}
        </text>
        {total_transaction && (
          <text x={x + 10} y={y + 35} fontSize="12px" stroke="none">
            {`Frekuensi: ${total_transaction}`}
          </text>
        )}
        {total_amount && (
          <text x={x + 10} y={y + 50} fontSize="12" stroke="none">
            {`Nominal transaksi: ${numberAbbv(total_amount)}`}
          </text>
        )}
      </g>
    )
  )
}

// Custom Tooltip content to show additional info
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const {
      entity_name,
      total_amount,
      total_transaction,
      entity_bank,
      entity_account_number,
    } = payload[0].payload
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
        }}
      >
        <p>
          <strong>
            {`${entity_name} - ${entity_bank} ${entity_account_number}`}
          </strong>
        </p>
        <p className="text-xs">Nominal Transaksi: {numberAbbv(total_amount)}</p>
        <p className="text-xs">Frekuensi: {total_transaction}</p>
      </div>
    )
  }

  return null
}

const Treemap = ({
  data,
  colorScale,
  width,
  height,
}: {
  data: Array<Record<string, string | number | Array<{}>>>
  colorScale: Array<string>
  width?: number
  height?: number
}) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RTreemap
        width={width || 600}
        height={height || 400}
        data={data}
        dataKey="value" // Use value to control the size of the nodes
        aspectRatio={4 / 4} // Adjusts the layout
        stroke="#fff"
        content={<CustomizedContent colorScale={colorScale} />} // Custom rendering for nodes
      >
        <Tooltip content={<CustomTooltip />} />
      </RTreemap>
    </ResponsiveContainer>
  )
}

export default Treemap
