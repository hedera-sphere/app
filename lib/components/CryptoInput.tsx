import { useState } from "react"

type CryptoInputProps = {
  max?: number
  tokenBalance?: number,
  TokenLogo: React.FC, // <Imagen />
  tokenName: string,
  initialValue: number
  onChange: (val: number) => void
}
export const CryptoInput = ({
  max,
  tokenBalance,
  TokenLogo,
  tokenName,
  initialValue
}: CryptoInputProps) => {
  const [value, setValue] = useState(initialValue)

  function setMax() {
    setValue(max ?? value)
  }
  return <div>
    <input
      value={value}
      type="number"
      onChange={(e) => {
        setValue(Number(e.target.value))
      }}
    />
    <div>
      <div>
        <TokenLogo />
        <span>{tokenName}</span>
      </div>
      <div>
        {
          tokenBalance && <>
            <span>Balance: {tokenBalance}</span>
            {max && <span onClick={setMax}>max</span>}
          </>
        }
      </div>
    </div>
  </div>
}