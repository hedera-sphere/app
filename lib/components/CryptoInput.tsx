export type CryptoInputProps = {
  max?: number
  maxMessage?: string,
  tokenBalance?: number, // ex. Balance: 1000, 2000
  tokenLogo: React.ReactNode, // <Imagen />
  tokenName: string,
  value: number
  onChange: (val: number) => void
}
export const CryptoInput = ({
  max,
  maxMessage,
  tokenBalance,
  tokenLogo,
  tokenName,
  value,
  onChange
}: CryptoInputProps) => {

  function setValue(newValue: number){
    newValue = Number(newValue?.toString()?.replace(/^0+/, '') || '0')
    // convert newValue to two decimals
    if(max){
      if(newValue >= 0 && newValue <= (max ?? 0)){
        onChange(newValue)
      }  
    }else{
      if(newValue >= 0){
        onChange(newValue)
      }
    }
  }

  function setMax() {
    const defaultValue = tokenBalance ?? value;
    setValue(max ?? defaultValue)
  }

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