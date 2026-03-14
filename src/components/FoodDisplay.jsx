// import React, { useEffect, useState } from "react";
// import {
//   collection,
//   addDoc,
//   onSnapshot,
//   doc,
//   deleteDoc,
//   updateDoc,
//   serverTimestamp,
//   increment,
// } from "firebase/firestore";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
// import { db, storage } from "../firebase";
// import { FaTrash, FaEdit } from "react-icons/fa";
// import { FaRegCommentDots } from "react-icons/fa6";
// import { toast } from "react-toastify";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import SearchBar from "./SearchBar";
// import { useMyContext } from "../Context/MyContext";

// export default function Dishes() {
//   // const [dishes, setDishes] = useState([]);
//   const [user, setUser] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [newDish, setNewDish] = useState({
//     name: "",
//     description: "",
//     priceOriginal: "",
//     priceDiscounted: "",
//     image: null,
//     category: "",
//   });
//   const [filterCategory, setFilterCategory] = useState("");
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [editingDish, setEditingDish] = useState(null);
//   const [commentModal, setCommentModal] = useState(null); // dishId or null
//   const [commentInput, setCommentInput] = useState("");
//   const [commentName, setCommentName] = useState("");
//   const [commentsMap, setCommentsMap] = useState({});
//   const { addToCart, dishes, capitalizeWords } = useMyContext();


//   // useEffect(() => {
//   //   const unsubscribe = onSnapshot(collection(db, "dishes"), (snapshot) => {
//   //     const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   //     setDishes(data);
//   //   });
//   //   return unsubscribe;
//   // }, []);

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//     });
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     const unsubscribes = dishes.map((dish) =>
//       onSnapshot(collection(db, "dishes", dish.id, "comments"), (snapshot) => {
//         setCommentsMap((prev) => ({
//           ...prev,
//           [dish.id]: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
//         }));
//       })
//     );
//     return () => unsubscribes.forEach((unsub) => unsub());
//   }, [dishes]);

//   const handleInputChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === "image") {
//       setNewDish((prev) => ({ ...prev, image: files[0] }));
//     } else {
//       setNewDish((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmitDish = async () => {
//     const { name, description, priceOriginal, priceDiscounted, image, category } = newDish;
//     if (!name || !description || !priceOriginal || !priceDiscounted || !category) {
//       toast.error("Please fill in all fields");
//       return;
//     }

//     try {
//       let imageUrl = editingDish?.image || null;
//       if (image) {
//         const imageRef = ref(storage, `dishes/${image.name}`);
//         await uploadBytesResumable(imageRef, image);
//         imageUrl = await getDownloadURL(imageRef);
//       }

//       const dishData = {
//         name,
//         description,
//         priceOriginal: parseFloat(priceOriginal),
//         priceDiscounted: parseFloat(priceDiscounted),
//         image: imageUrl,
//         category,
//         likes: editingDish?.likes || 0,
//         createdAt: serverTimestamp(),
//       };

//       if (editingDish) {
//         await updateDoc(doc(db, "dishes", editingDish.id), dishData);
//         toast.success("Dish updated");
//       } else {
//         await addDoc(collection(db, "dishes"), dishData);
//         toast.success("Dish added");
//       }

//       setNewDish({ name: "", description: "", priceOriginal: "", priceDiscounted: "", image: null, category: "" });
//       setEditingDish(null);
//       setShowAddModal(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to save dish");
//     }
//   };

//   const handleEdit = (dish) => {
//     setEditingDish(dish);
//     setNewDish({
//       name: dish.name,
//       description: dish.description,
//       priceOriginal: dish.priceOriginal,
//       priceDiscounted: dish.priceDiscounted,
//       category: dish.category,
//       image: null,
//     });
//     setShowAddModal(true);
//   };

//   const confirmDeleteToast = async (dish) => {
//     if (window.confirm("Are you sure you want to delete this dish?")) {
//       await deleteDoc(doc(db, "dishes", dish.id));
//       toast.success("Dish deleted");
//     }
//   };

//   const handleLike = async (id) => {
//     await updateDoc(doc(db, "dishes", id), { likes: increment(1) });
//   };

//   // ---- FIXED COMMENT HANDLING ----
//   const handleAddComment = async (dishId) => {
//     if (!commentInput || !commentName) {
//       toast.error("Please enter your name and a comment.");
//       return;
//     }
//     try {
//       await addDoc(collection(db, "dishes", dishId, "comments"), {
//         text: commentInput,
//         name: commentName,
//         createdAt: serverTimestamp(),
//         userId: user?.uid || null,
//       });
//       setCommentInput("");
//       setCommentName("");
//       // Optionally close modal after adding:
//       // setCommentModal(null);
//       toast.success("Comment added!");
//     } catch (err) {
//       toast.error("Failed to add comment.");
//     }
//   };

//   const handleDeleteComment = async (dishId, commentId) => {
//     await deleteDoc(doc(db, "dishes", dishId, "comments", commentId));
//   };


//   const filteredDishes = dishes.filter((dish) =>
//     dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     dish.description.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div id="dishes" className="p-4">
//       <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
//         <h2 className="text-2xl font-bold">Dishes</h2>
//         <input
//           type="text"
//           placeholder="Search dishes..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="px-4 py-2 border border-gray-300 rounded w-full md:w-1/3 focus:outline-none focus:ring focus:border-blue-300"
//         />
//         {user && (
//           <button
//             onClick={() => {
//               setNewDish({ name: "", description: "", priceOriginal: "", priceDiscounted: "", image: null, category: "" });
//               setEditingDish(null);
//               setShowAddModal(true);
//             }}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Add Dish
//           </button>
//         )}
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredDishes.map((dish) => (
//           <div key={dish.id} className="bg-white p-4 rounded shadow-md">
//             <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded mb-2" />
//             <h3 className="text-lg font-semibold">{capitalizeWords(dish.name)}</h3>
//             <p className="text-sm text-gray-600 mb-2 line-clamp-2">{dish.description}</p>
//             <p className="text-xs italic text-purple-600">{dish.category}</p>

//             <div className="text-sm mb-2">
//   <span className="text-gray-400">
//     Original Price: <span className="line-through">₦{dish.priceOriginal?.toLocaleString()}</span>
//   </span>
//   <span className="font-semibold text-green-600 block">
//     Discount: ₦{dish.priceDiscounted?.toLocaleString()}
//   </span>
// </div>

//             <div className="flex justify-between items-center mt-2">
//               <div onClick={() => handleLike(dish.id)} className="cursor-pointer text-red-500">
//                 ❤️ {dish.likes || 0}
//               </div>
//               <div
//                 onClick={() => {
//                   setCommentModal(dish.id);
//                   setCommentInput("");
//                   setCommentName("");
//                 }}
//                 className="cursor-pointer text-blue-600 flex items-center"
//               >
//                 <FaRegCommentDots className="mr-1" /> {commentsMap[dish.id]?.length || 0}
//               </div>
//               {/* <a
//   href={`https://wa.me/2348038652949?text=${encodeURIComponent(
//     `🍽️ *Order Request*\n\n*Dish:* ${capitalizeWords(dish.name)}\n*Price:* ₦${dish.priceDiscounted?.toLocaleString()}\n\n[ View Order ]`
//   )}`}
//   target="_blank"
//   rel="noopener noreferrer"
//   className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
// >
//   Order
// </a> */}

// <button
//   onClick={() => addToCart(dish, dish.priceDiscounted)}
//   className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
// >
//   Add to Cart
// </button>

//             </div>

//             {user && (
//               <div className="flex justify-end mt-3 gap-3 text-xl">
//                 <FaEdit
//                   onClick={() => handleEdit(dish)}
//                   className="text-blue-600 cursor-pointer hover:text-blue-800"
//                 />
//                 <FaTrash
//                   onClick={() => confirmDeleteToast(dish)}
//                   className="text-red-600 cursor-pointer hover:text-red-800"
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       {/* ---- COMMENT MODAL ---- */}
//       {commentModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//             <h3 className="text-xl font-bold mb-4">Comments</h3>
//             <div className="mb-4 max-h-48 overflow-y-auto">
//               {(commentsMap[commentModal] || []).length === 0 && (
//                 <div className="text-gray-400 text-center">No comments yet.</div>
//               )}
//               {(commentsMap[commentModal] || []).map((comment) => (
//                 <div key={comment.id} className="border-b py-2 flex justify-between items-center">
//                   <div>
//                     <span className="font-semibold">{comment.name || "Anonymous"}: </span>
//                     <span>{comment.text}</span>
//                     <span className="text-xs text-gray-400 ml-2">
//                       {comment.createdAt?.seconds
//                         ? new Date(comment.createdAt.seconds * 1000).toLocaleString()
//                         : ""}
//                     </span>
//                   </div>
//                  {user && (
//   <FaTrash
//     className="text-red-500 cursor-pointer ml-2"
//     onClick={() => handleDeleteComment(commentModal, comment.id)}
//   />
// )}

//                 </div>
//               ))}
//             </div>
//             <input
//               type="text"
//               placeholder="Your name"
//               className="w-full mb-2 border px-3 py-2"
//               value={commentName}
//               onChange={(e) => setCommentName(e.target.value)}
//             />
//             <textarea
//               placeholder="Add a comment..."
//               className="w-full mb-2 border px-3 py-2"
//               value={commentInput}
//               onChange={(e) => setCommentInput(e.target.value)}
//             ></textarea>
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setCommentModal(null)}
//                 className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//               >
//                 Close
//               </button>
//               <button
//                 onClick={async () => {
//                   await handleAddComment(commentModal);
//                   // Optionally: setCommentModal(null);
//                 }}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Add Comment
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/** ADD/EDIT MODAL **/}
//       {showAddModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//             <h3 className="text-xl font-bold mb-4">{editingDish ? "Edit Dish" : "Add Dish"}</h3>
//             <input name="name" type="text" placeholder="Dish Name" value={newDish.name} onChange={handleInputChange} className="w-full mb-2 border px-3 py-2" />
//             <textarea name="description" placeholder="Description" value={newDish.description} onChange={handleInputChange} className="w-full mb-2 border px-3 py-2" />
//             <input name="priceOriginal" type="number" placeholder="Original Price (₦)" value={newDish.priceOriginal} onChange={handleInputChange} className="w-full mb-2 border px-3 py-2" />
//             <input name="priceDiscounted" type="number" placeholder="Discounted Price (₦)" value={newDish.priceDiscounted} onChange={handleInputChange} className="w-full mb-2 border px-3 py-2" />
//             <input name="category" type="text" placeholder="Category (e.g., Snacks, Drinks, Meals)" value={newDish.category} onChange={handleInputChange} className="w-full mb-2 border px-3 py-2" />
//             <input name="image" type="file" accept="image/*" onChange={handleInputChange} className="w-full mb-4" />
//             <div className="flex justify-end gap-3">
//               <button onClick={() => setShowAddModal(false)} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
//               <button onClick={handleSubmitDish} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">{editingDish ? "Update" : "Save"}</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }