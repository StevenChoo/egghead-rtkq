import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store";
import { luckyDogChosen, selectAllDogs, selectDogsLoading } from "./dogsSlice";

export function LuckyDog() {
  const dispatch = useDispatch();
  const myDogs = useSelector(selectAllDogs);
  const isLoading = useSelector(selectDogsLoading);
  const luckyDog = useSelector((state: RootState) => state.dogs.luckyDog);

  const onLuckyDogChosen = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    dispatch(luckyDogChosen({ id }));
  };

  return (
    <div className="luckyDogComponent">
      <label htmlFor="luckyDog">Lucky dog:</label>
      <select id="luckyDog" value={luckyDog} onChange={onLuckyDogChosen}>
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
