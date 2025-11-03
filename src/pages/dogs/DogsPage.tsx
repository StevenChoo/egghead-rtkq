import { useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import type { Dog } from "../../types";
import { LuckyDog } from "./LuckyDog";
import { Loader } from "../../components/Loader";
import {
  useGetDogsQuery,
  useAddDogMutation,
  useRemoveDogMutation,
} from "../../store/apiSlice";
import { selectLuckyDogId } from "./uiSlice";
import { getSize, getAge } from "../../utils/dogUtils";

export function DogsPage() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { data: dogsData = {}, isLoading } = useGetDogsQuery();
  const [addDog] = useAddDogMutation();
  const [removeDog] = useRemoveDogMutation();
  const luckyDogId = useSelector(selectLuckyDogId);

  // Transform dogs data with calculated fields
  const myDogs = useMemo(() => {
    return Object.values(dogsData).map((dog) => ({
      ...dog,
      size: getSize(dog.weight),
      age: getAge(dog.dob),
    }));
  }, [dogsData]);

  const handleDeleteDog = (e: React.MouseEvent, dog: Dog) => {
    e.preventDefault();
    removeDog(dog.id);
  };

  const handleNewDog = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    e.currentTarget.reset();
    const data = Object.fromEntries(formData) as Record<string, string>;

    addDog({
      name: data.name,
      breed: data.breed,
      weight: Number(data.weight),
      dob: data.dob,
    });

    dialogRef.current?.close();
  };

  return (
    <div className="page">
      <h1>My Dogs</h1>
      <p>
        It&apos;s important that you provide us with a complete and accurate
        list of <i>all</i> of your dogs, so that we can provide them with the
        best services possible.
      </p>
      {!isLoading && myDogs.length > 0 && (
        <>
          <p>Choose the lucky dog that will be groomed next.</p>
          <LuckyDog />
        </>
      )}
      {isLoading ? (
        <Loader />
      ) : (
        myDogs.map((dog) => {
        return (
          <div
            key={dog.id}
            className={
              "card closable" + (luckyDogId === dog.id ? " luckyDog" : "")
            }
          >
            <i className="dogImg">🐶</i>
            <div style={{ flex: 1 }}>
              <div className="dogCardHeader">
                <h3 className="dogName">{dog.name}</h3>
                <button
                  className="deleteDog"
                  aria-label={`Remove ${dog.name} from your dog list`}
                  onClick={(e) => handleDeleteDog(e, dog)}
                >
                  x
                </button>
              </div>
              <div className="cardContents">
                <dl>
                  <dt>Size:</dt>
                  <dd>{dog.size}</dd>
                  <dt>Age:</dt>
                  <dd>{dog.age}</dd>
                  <dt>Breed:</dt>
                  <dd>{dog.breed}</dd>
                </dl>
              </div>
            </div>
          </div>
        );
      })
      )}
      <button
        className="btn"
        onClick={() => dialogRef.current?.showModal()}
      >
        Add Dog
      </button>
      <dialog ref={dialogRef}>
        <form method="dialog" onSubmit={handleNewDog}>
          <h2>Add a Dog</h2>
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required />
          <label htmlFor="breed">Breed</label>
          <select id="breed" name="breed" required>
            <option value="">Select a breed</option>
            <option value="golden-retriever">Golden Retriever</option>
            <option value="husky">Husky</option>
            <option value="beagle">Beagle</option>
            <option value="poodle">Poodle</option>
            <option value="bulldog">Bulldog</option>
            <option value="hound">Hound</option>
            <option value="shephard">Shephard</option>
          </select>
          <label htmlFor="weight">Weight (lbs)</label>
          <input type="number" id="weight" name="weight" required />
          <label htmlFor="dob">Date of Birth</label>
          <input type="date" id="dob" name="dob" required />
          <div className="dialogActions">
            <button
              type="button"
              className="btn btnSecondary"
              onClick={() => dialogRef.current?.close()}
            >
              Cancel
            </button>
            <button type="submit" className="btn">
              Add Dog
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
