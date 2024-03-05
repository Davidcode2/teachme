import uploadIcon from '../../assets/icons/icons8-upload-48.png';
import addToShoppingCartIcon from '../../assets/icons/icons8-add-shopping-cart-50.png';

function ActionButtons() {
  return (
    <>
      <div className="flex">
        <div className="hidden">rating</div>
        <div className="hidden">downloads</div>
        <img src={addToShoppingCartIcon} width="30" alt=""/>
      </div>
    </>
  )
}

export default ActionButtons;

