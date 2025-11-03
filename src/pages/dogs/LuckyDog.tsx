import { useDispatch, useSelector } from "react-redux";
import { useGetDogsQuery } from "../../store/apiSlice";
import { setLuckyDog, selectLuckyDogId } from "./uiSlice";

export function LuckyDog() {
  const dispatch = useDispatch();
  const { data: dogsData = {}, isLoading } = useGetDogsQuery();
  const luckyDogId = useSelector(selectLuckyDogId);

  // Data already transformed by transformResponse in API slice
  const myDogs = Object.values(dogsData);

  const onLuckyDogChosen = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value || null;
    dispatch(setLuckyDog(id));
  };

  return (
    <div className="luckyDogComponent">
      <label htmlFor="luckyDog">Lucky dog:</label>
      <select id="luckyDog" value={luckyDogId || ""} onChange={onLuckyDogChosen}>
        <option value="">(Select Dog)</option>
        {!isLoading &&
          myDogs &&
          myDogs.map((dog) => {
          return (
            <option value={dog.id} key={dog.id}>
              {dog.name}
            </option>
          );
        })}
      </select>
    </div>
  );
}
