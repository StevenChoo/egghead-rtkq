import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { useGetDogsQuery } from "../../store/apiSlice";
import { setLuckyDog, selectLuckyDogId } from "./uiSlice";
import { getSize, getAge } from "../../utils/dogUtils";

export function LuckyDog() {
  const dispatch = useDispatch();
  const { data: dogsData = {}, isLoading } = useGetDogsQuery();
  const luckyDogId = useSelector(selectLuckyDogId);

  // Transform dogs data with calculated fields
  const myDogs = useMemo(() => {
    return Object.values(dogsData).map((dog) => ({
      ...dog,
      size: getSize(dog.weight),
      age: getAge(dog.dob),
    }));
  }, [dogsData]);

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
