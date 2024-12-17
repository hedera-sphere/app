import { useEffect, useState } from "react"

export type CryptoInputProps = {
  max?: number
  maxMessage?: string,
  tokenBalance?: number, // ex. Balance: 1000, 2000
  tokenLogo: React.ReactNode, // <Imagen />
  tokenName: string,
  initialValue: number
  onChange: (val: number) => void
}
export const CryptoInput = ({
  max,
  maxMessage,
  tokenBalance,
  tokenLogo,
  tokenName,
  initialValue,
  onChange
}: CryptoInputProps) => {
  const [value, setValueState] = useState(initialValue)
  function setValue(val: number){
    // convert val to two decimals
  
    if(val >= 0 && val <= (max ?? 0)){
      setValueState(val)
    }
  }

  function setMax() {
    const defaultValue = tokenBalance ?? value;
    setValue(max ?? defaultValue)
  }

  useEffect(()=>{
    onChange(value)
  },[value, onChange])

  return <div>
    <input
      value={value}
      min={0}
      type="number"
      onChange={(e) => {
        setValue(Number(e.target.value))
      }}
    />
    <div>
      <div>
        {tokenLogo}
        <span>{tokenName}</span>
      </div>
      <div>
        {maxMessage && <span onClick={setMax}>{maxMessage}</span>}
      </div>
    </div>
  </div>
}