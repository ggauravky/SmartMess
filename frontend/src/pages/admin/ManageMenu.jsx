import { useState, useEffect } from "react";
import { format } from "date-fns";
import { FiPlus, FiTrash2, FiSave, FiCalendar } from "react-icons/fi";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import styles from "./ManageMenu.module.css";

const MEAL_TYPES = ["breakfast", "lunch", "snacks", "dinner"];

const ManageMenu = () => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [menu, setMenu] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
  });
  const [newItems, setNewItems] = useState({
    breakfast: "",
    lunch: "",
    snacks: "",
    dinner: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMenu({
      breakfast: ["Poha", "Chai", "Bread Butter"],
      lunch: ["Rice", "Dal", "Paneer Curry", "Roti"],
      snacks: ["Samosa", "Tea"],
      dinner: ["Chapati", "Mix Veg", "Dal Fry"],
    });
  }, [selectedDate]);

  const handleAddItem = (mealType) => {
    const item = newItems[mealType].trim();
    if (!item) return;
    setMenu((prev) => ({ ...prev, [mealType]: [...prev[mealType], item] }));
    setNewItems((prev) => ({ ...prev, [mealType]: "" }));
  };

  const handleRemoveItem = (mealType, index) => {
    setMenu((prev) => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index),
    }));
  };

  const handleSaveMenu = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Menu saved successfully!");
    } catch (error) {
      toast.error("Failed to save menu");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e, mealType) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddItem(mealType);
    }
  };

  return (
    <AdminLayout>
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <h1>Manage Menu</h1>
            <p>Add or edit daily menu items</p>
          </div>
          <Button icon={FiSave} onClick={handleSaveMenu} loading={loading}>
            Save Menu
          </Button>
        </header>

        <Card className={styles.dateCard}>
          <FiCalendar className={styles.calendarIcon} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.datePicker}
          />
          <span className={styles.dateLabel}>
            {format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
          </span>
        </Card>

        <div className={styles.mealsGrid}>
          {MEAL_TYPES.map((mealType) => (
            <Card key={mealType} className={styles.mealCard}>
              <div className={styles.mealHeader}>
                <h3>{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</h3>
                <span className={styles.itemCount}>
                  {menu[mealType].length} items
                </span>
              </div>
              <div className={styles.itemsList}>
                {menu[mealType].map((item, index) => (
                  <div key={index} className={styles.item}>
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemoveItem(mealType, index)}
                      className={styles.removeBtn}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                {menu[mealType].length === 0 && (
                  <p className={styles.noItems}>No items added</p>
                )}
              </div>
              <div className={styles.addItem}>
                <input
                  type="text"
                  value={newItems[mealType]}
                  onChange={(e) =>
                    setNewItems((prev) => ({
                      ...prev,
                      [mealType]: e.target.value,
                    }))
                  }
                  onKeyPress={(e) => handleKeyPress(e, mealType)}
                  placeholder="Add new item..."
                  className={styles.addInput}
                />
                <button
                  onClick={() => handleAddItem(mealType)}
                  className={styles.addBtn}
                  disabled={!newItems[mealType].trim()}
                >
                  <FiPlus />
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageMenu;
