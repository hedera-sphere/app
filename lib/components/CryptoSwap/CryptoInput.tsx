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
      step={1}
      type="number"
      onChange={(e) => {
        const inputValue = e.target.value;
        // Remove decimals by converting to an integer
        const intValue = Math.floor(Number(inputValue));
        setValue(intValue >= 0 ? intValue : 0); // Ensure non-negative values
      }}
    />
    <div>
      <div>
        {tokenLogo}
        <span>{tokenName}</span>
      </div>
      <div>
        {maxMessage && <span onClick={setMax}><u>{maxMessage}</u></span>}
      </div>
    </div>
  </div>
}