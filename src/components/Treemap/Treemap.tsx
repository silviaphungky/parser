'use client'
import { numberAbbv } from '@/utils/numberAbbv'
import { ResponsiveContainer, Treemap as RTreemap, Tooltip } from 'recharts'

// Custom color scale based on frequency
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
  const { x, y, width, height, name, frequency, colorScale, value } = props

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getColor(frequency, colorScale) || 'white'}
        stroke="white"
      />
      <text x={x + 10} y={y + 20} fontSize="15" fontWeight="bold" stroke="none">
        {name}
      </text>
      {frequency && (
        <text x={x + 10} y={y + 40} fontSize="12px" stroke="none">
          {`Frekuensi: ${frequency}`}
        </text>
      )}
      {value && (
        <text x={x + 10} y={y + 60} fontSize="12" stroke="none">
          {`Nominal transaksi: ${numberAbbv(value)}`}
        </text>
      )}
    </g>
  )
}

// Custom Tooltip content to show additional info
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value, frequency } = payload[0].payload
    return (
      <div
        style={{
          backgroundColor: 'white',
          border: '1px solid #ccc',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <p>
          <strong>{name}</strong>
        </p>
        <p>Nominal Transaksi: {numberAbbv(value)}</p>
        <p>Frekuensi: {frequency}</p>
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
