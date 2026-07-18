import { zodResolver } from "@hookform/resolvers/zod";
import {
  Add,
  CategoryOutlined,
  CheckCircle,
  DeleteOutline,
  EditOutlined,
  FastfoodOutlined,
  ImageOutlined,
  KeyboardArrowDown,
  LocalFireDepartmentOutlined,
  RestaurantMenu,
  SearchOutlined,
  StarBorder,
} from "@mui/icons-material";
import {
  Box,
  Button as MuiButton,
  Card,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Select,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../../features/menu/components/Button";
import {
  createMenuCategory,
  createMenuDish,
  deleteMenuDish,
  getMenuCategories,
  getMenuDishes,
  MenuCategory,
  MenuDish,
  updateMenuDish,
} from "../../services/menu-management.service";
import { useAppSelector } from "../../store/hooks/cartHooks";
import { Colors } from "../../theme";
import {
  showErrorSnackbar,
  showSuccessSnackbar,
} from "../../utils/notifications";
import PopUpDialog from "../../features/menu/components/PopUpDialog";

const optionalImageUrlSchema = z.preprocess((value) => {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? undefined : trimmed;
  }

  return value;
}, z.string().trim().url("Enter a valid image URL").optional());

const categorySchema = z.object({
  name: z.string().trim().min(1, "Category name is required").max(200),
});

const dishSchema = z.object({
  categoryId: z.string().min(1, "Choose a category"),
  name: z.string().trim().min(1, "Dish name is required").max(200),
  description: z.string().trim().max(1000).optional(),
  price: z.coerce.number().positive("Price must be greater than 0"),
  image: optionalImageUrlSchema,
  isVegetarian: z.boolean(),
  isSpicy: z.boolean(),
  isAvailable: z.boolean(),
  isPopular: z.boolean(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;
type DishFormValues = z.infer<typeof dishSchema>;

const categoryFormDefaults: CategoryFormValues = {
  name: "",
};

const dishFormDefaults: DishFormValues = {
  categoryId: "",
  name: "",
  description: "",
  price: 0,
  image: "",
  isVegetarian: false,
  isSpicy: false,
  isAvailable: true,
  isPopular: false,
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);

const getDishImage = (dish: MenuDish) =>
  dish.image || "https://assets.dilum.me/deliveroo-clone/svgs/NotFound.svg";

const MENU_MANAGER_ROLES = ["super_admin", "admin"];
const DISHES_PER_PAGE = 6;

const RestaurantMenuPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const restaurantId = user?.restaurantId;
  const canManageMenu =
    user?.role === "platform_admin" ||
    Boolean(
      user?.role === "restaurant_user" &&
        user.restaurantRole &&
        MENU_MANAGER_ROLES.includes(user.restaurantRole),
    );
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isWideLayout = useMediaQuery(theme.breakpoints.up("xl"));

  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [dishes, setDishes] = useState<MenuDish[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dishPage, setDishPage] = useState(1);
  const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] =
    useState<HTMLElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isDishDialogOpen, setIsDishDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuDish | null>(null);
  const [dishPendingDeletion, setDishPendingDeletion] =
    useState<MenuDish | null>(null);
  const [isDeletingDish, setIsDeletingDish] = useState(false);
  const [updatingDishIds, setUpdatingDishIds] = useState<Set<string>>(
    () => new Set(),
  );

  const categoryForm = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryFormDefaults,
  });

  const dishForm = useForm<DishFormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: dishFormDefaults,
  });
  const { setValue: setDishValue } = dishForm;

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId,
  );

  const visibleDishes = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return dishes.filter((dish) => {
      const matchesCategory =
        selectedCategoryId === "" || dish.categoryId === selectedCategoryId;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        dish.name.toLowerCase().includes(normalizedSearch) ||
        (dish.description ?? "").toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [dishes, searchTerm, selectedCategoryId]);

  const visibleCategoryLimit = isMobile ? 2 : isWideLayout ? 8 : 5;
  const visibleMenuCategories = categories.slice(0, visibleCategoryLimit);
  const overflowMenuCategories = categories.slice(visibleCategoryLimit);
  const selectedOverflowCategory = overflowMenuCategories.find(
    (category) => category.id === selectedCategoryId,
  );
  const dishPageCount = Math.max(
    1,
    Math.ceil(visibleDishes.length / DISHES_PER_PAGE),
  );
  const paginatedDishes = visibleDishes.slice(
    (dishPage - 1) * DISHES_PER_PAGE,
    dishPage * DISHES_PER_PAGE,
  );

  useEffect(() => {
    setDishPage(1);
  }, [searchTerm, selectedCategoryId]);

  useEffect(() => {
    setDishPage((currentPage) => Math.min(currentPage, dishPageCount));
  }, [dishPageCount]);

  const loadMenu = useCallback(async () => {
    if (!restaurantId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [categoryList, dishList] = await Promise.all([
        getMenuCategories(restaurantId),
        getMenuDishes(restaurantId),
      ]);

      setCategories(categoryList);
      setDishes(dishList);
      setSelectedCategoryId((currentCategoryId) => {
        if (
          currentCategoryId &&
          categoryList.some((category) => category.id === currentCategoryId)
        ) {
          return currentCategoryId;
        }

        return categoryList[0]?.id ?? "";
      });
      setDishValue("categoryId", categoryList[0]?.id ?? "");
    } catch {
      showErrorSnackbar("Failed to load restaurant menu");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantId, setDishValue]);

  useEffect(() => {
    void loadMenu();
  }, [loadMenu]);

  useEffect(() => {
    if (selectedCategoryId) {
      setDishValue("categoryId", selectedCategoryId);
    }
  }, [selectedCategoryId, setDishValue]);

  const openCategoryDialog = () => {
    if (!canManageMenu) {
      showErrorSnackbar("You do not have permission to manage menu items");
      return;
    }

    categoryForm.reset(categoryFormDefaults);
    setIsCategoryDialogOpen(true);
  };

  const closeCategoryDialog = () => {
    if (!categoryForm.formState.isSubmitting) {
      setIsCategoryDialogOpen(false);
    }
  };

  const openDishDialog = () => {
    if (!canManageMenu) {
      showErrorSnackbar("You do not have permission to manage menu items");
      return;
    }

    setEditingDish(null);
    dishForm.reset({
      ...dishFormDefaults,
      categoryId: selectedCategoryId || categories[0]?.id || "",
    });
    setIsDishDialogOpen(true);
  };

  const openEditDishDialog = (dish: MenuDish) => {
    if (!canManageMenu) return;

    setEditingDish(dish);
    dishForm.reset({
      categoryId: dish.categoryId,
      name: dish.name,
      description: dish.description ?? "",
      price: dish.price,
      image: dish.image ?? "",
      isVegetarian: dish.isVegetarian,
      isSpicy: dish.isSpicy,
      isAvailable: dish.isAvailable,
      isPopular: Boolean(dish.isPopular),
    });
    setIsDishDialogOpen(true);
  };

  const closeDishDialog = () => {
    if (!dishForm.formState.isSubmitting) {
      setIsDishDialogOpen(false);
      setEditingDish(null);
    }
  };

  const handleCreateCategory = categoryForm.handleSubmit(async (values) => {
    if (!canManageMenu) {
      showErrorSnackbar("You do not have permission to manage menu items");
      return;
    }

    if (!restaurantId) {
      showErrorSnackbar("Restaurant assignment is missing");
      return;
    }

    try {
      const createdCategory = await createMenuCategory({
        restaurant: restaurantId,
        name: values.name,
        sortOrder: categories.length,
      });

      setCategories((currentCategories) => [
        ...currentCategories,
        createdCategory,
      ]);
      setSelectedCategoryId(createdCategory.id);
      setIsCategoryDialogOpen(false);
      showSuccessSnackbar("Category created");
    } catch {
      showErrorSnackbar("Failed to create category");
    }
  });

  const handleSaveDish = dishForm.handleSubmit(async (values) => {
    if (!canManageMenu) {
      showErrorSnackbar("You do not have permission to manage menu items");
      return;
    }

    try {
      if (editingDish) {
        const updatedDish = await updateMenuDish(editingDish.id, {
          categoryId: values.categoryId,
          name: values.name,
          description: values.description ?? "",
          price: values.price,
          image: values.image || null,
          isVegetarian: values.isVegetarian,
          isSpicy: values.isSpicy,
          isAvailable: values.isAvailable,
          isPopular: values.isPopular,
        });

        setDishes((currentDishes) =>
          currentDishes.map((dish) =>
            dish.id === updatedDish.id ? updatedDish : dish,
          ),
        );
        setSelectedCategoryId(updatedDish.categoryId);
        setIsDishDialogOpen(false);
        setEditingDish(null);
        showSuccessSnackbar("Dish updated");
        return;
      }

      const createdDish = await createMenuDish({
        categoryId: values.categoryId,
        name: values.name,
        description: values.description || undefined,
        price: values.price,
        image: values.image || undefined,
        isVegetarian: values.isVegetarian,
        isSpicy: values.isSpicy,
        isAvailable: values.isAvailable,
        isPopular: values.isPopular,
        tags: values.isPopular ? ["BESTSELLER"] : [],
        sortOrder: dishes.filter(
          (dish) => dish.categoryId === values.categoryId,
        ).length,
      });

      setDishes((currentDishes) => [...currentDishes, createdDish]);
      setSelectedCategoryId(createdDish.categoryId);
      setIsDishDialogOpen(false);
      showSuccessSnackbar("Dish created");
    } catch {
      showErrorSnackbar(
        editingDish ? "Failed to update dish" : "Failed to create dish",
      );
    }
  });

  const handleAvailabilityChange = async (
    dish: MenuDish,
    isAvailable: boolean,
  ) => {
    if (!canManageMenu || updatingDishIds.has(dish.id)) return;

    setUpdatingDishIds((currentIds) => new Set(currentIds).add(dish.id));
    try {
      const updatedDish = await updateMenuDish(dish.id, { isAvailable });
      setDishes((currentDishes) =>
        currentDishes.map((currentDish) =>
          currentDish.id === updatedDish.id ? updatedDish : currentDish,
        ),
      );
      showSuccessSnackbar(
        isAvailable ? "Dish is now available" : "Dish marked unavailable",
      );
    } catch {
      showErrorSnackbar("Failed to update dish availability");
    } finally {
      setUpdatingDishIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(dish.id);
        return nextIds;
      });
    }
  };

  const handleDeleteDish = async () => {
    if (!dishPendingDeletion || isDeletingDish) return;

    setIsDeletingDish(true);
    try {
      await deleteMenuDish(dishPendingDeletion.id);
      setDishes((currentDishes) =>
        currentDishes.filter((dish) => dish.id !== dishPendingDeletion.id),
      );
      setDishPendingDeletion(null);
      setEditingDish(null);
      setIsDishDialogOpen(false);
      showSuccessSnackbar("Dish deleted");
    } catch {
      showErrorSnackbar("Failed to delete dish");
    } finally {
      setIsDeletingDish(false);
    }
  };

  if (!restaurantId) {
    return (
      <Card
        sx={{
          p: 4,
          bgcolor: Colors.background.light,
          border: `1px solid ${Colors.border.default}`,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
          Restaurant assignment missing
        </Typography>
        <Typography sx={{ color: Colors.text.lighter }}>
          Your account is authenticated, but it is not linked to a restaurant.
          Assign this user to a restaurant before managing the menu.
        </Typography>
      </Card>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 900, mb: 1, color: Colors.text.default }}
          >
            Menu Management
          </Typography>
          <Typography sx={{ color: Colors.text.lighter }}>
            Build your restaurant menu by creating categories first, then adding
            dishes inside them.
          </Typography>
        </Box>

        {canManageMenu ? (
          <Box
            sx={{
              display: "flex",
              gap: 1.5,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            <Button
              variant="outlined"
              onClick={openCategoryDialog}
              sx={{
                flex: { xs: 1, sm: "initial" },
                px: 2,
                py: 1,
                fontWeight: 800,
                color: Colors.background.brand,
              }}
            >
              <Add sx={{ mr: 1 }} />
              Category
            </Button>
            <Button
              variant="filled"
              onClick={openDishDialog}
              disabled={categories.length === 0}
              sx={{
                flex: { xs: 1, sm: "initial" },
                px: 2,
                py: 1,
                fontWeight: 800,
                color: Colors.text.inverse,
              }}
            >
              <Add sx={{ mr: 1 }} />
              Dish
            </Button>
          </Box>
        ) : (
          <Chip
            label="Read-only access"
            sx={{
              bgcolor: "rgba(0, 204, 188, 0.12)",
              color: Colors.background.brand,
              fontWeight: 800,
            }}
          />
        )}
      </Box>

      <Box sx={{ display: "grid", gap: 3 }}>
        <Box>
          <Card
            sx={{
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: `1px solid ${Colors.border.default}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1.2rem" }}>
                  Categories
                </Typography>
                <Typography
                  sx={{ color: Colors.text.lighter, fontSize: "0.9rem" }}
                >
                  {categories.length} sections in this menu
                </Typography>
              </Box>
              <CategoryOutlined sx={{ color: Colors.background.brand }} />
            </Box>

            {isLoading ? (
              <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: Colors.background.brand }} />
              </Box>
            ) : categories.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Typography sx={{ fontWeight: 800, mb: 1 }}>
                  No categories yet
                </Typography>
                <Typography sx={{ color: Colors.text.lighter, mb: 2 }}>
                  Start with sections like Starters, Mains, Drinks, or Desserts.
                </Typography>
                {canManageMenu ? (
                  <Button
                    variant="filled"
                    onClick={openCategoryDialog}
                    sx={{ width: "100%", fontWeight: 800 }}
                  >
                    Create first category
                  </Button>
                ) : (
                  <Typography
                    sx={{ color: Colors.text.lighter, fontSize: "0.9rem" }}
                  >
                    Ask a restaurant admin to create menu categories.
                  </Typography>
                )}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  overflow: "hidden",
                }}
              >
                {visibleMenuCategories.map((category) => {
                  const categoryDishCount = dishes.filter(
                    (dish) => dish.categoryId === category.id,
                  ).length;
                  const selected = category.id === selectedCategoryId;

                  return (
                    <Box
                      component="button"
                      key={category.id}
                      onClick={() => setSelectedCategoryId(category.id)}
                      sx={{
                        minWidth: 0,
                        maxWidth: { xs: "none", md: 220 },
                        flex: { xs: "1 1 0", md: "0 1 auto" },
                        border: "none",
                        borderRadius: "999px",
                        px: { xs: 1.25, sm: 2 },
                        py: 0.75,
                        bgcolor: selected
                          ? Colors.background.brand
                          : Colors.background.light,
                        color: selected
                          ? Colors.text.inverse
                          : Colors.text.default,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75,
                        transition: "background-color 0.18s ease",
                        outline: selected
                          ? "none"
                          : `1px solid ${Colors.border.default}`,
                        "&:hover": {
                          bgcolor: selected
                            ? Colors.background.brand
                            : "rgba(0, 204, 188, 0.08)",
                        },
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "inherit",
                          fontWeight: 800,
                          fontSize: "0.9rem",
                        }}
                      >
                        {category.name} ({categoryDishCount})
                      </Typography>
                      {selected && (
                        <CheckCircle sx={{ fontSize: 17, flexShrink: 0 }} />
                      )}
                    </Box>
                  );
                })}
                {overflowMenuCategories.length > 0 && (
                  <>
                    <MuiButton
                      endIcon={<KeyboardArrowDown />}
                      onClick={(event) =>
                        setCategoryMenuAnchorEl(event.currentTarget)
                      }
                      sx={{
                        minWidth: 0,
                        maxWidth: { xs: 112, sm: 220 },
                        flex: { xs: "0 1 112px", md: "0 0 auto" },
                        borderRadius: "999px",
                        px: { xs: 1.25, sm: 2 },
                        py: 0.75,
                        textTransform: "none",
                        color: selectedOverflowCategory
                          ? Colors.text.inverse
                          : Colors.background.brand,
                        bgcolor: selectedOverflowCategory
                          ? Colors.background.brand
                          : Colors.background.light,
                        outline: selectedOverflowCategory
                          ? "none"
                          : `1px solid ${Colors.border.default}`,
                        fontWeight: 800,
                        "&:hover": {
                          bgcolor: selectedOverflowCategory
                            ? Colors.background.brandHover
                            : "rgba(0, 204, 188, 0.08)",
                        },
                        "& .MuiButton-endIcon": {
                          ml: 0.5,
                          flexShrink: 0,
                        },
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {selectedOverflowCategory?.name ?? "More"}
                      </Box>
                    </MuiButton>
                    <Menu
                      anchorEl={categoryMenuAnchorEl}
                      open={Boolean(categoryMenuAnchorEl)}
                      onClose={() => setCategoryMenuAnchorEl(null)}
                      PaperProps={{ sx: { mt: 1, minWidth: 210 } }}
                    >
                      {overflowMenuCategories.map((category) => (
                        <MenuItem
                          key={category.id}
                          selected={category.id === selectedCategoryId}
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setCategoryMenuAnchorEl(null);
                          }}
                        >
                          {category.name} (
                          {
                            dishes.filter(
                              (dish) => dish.categoryId === category.id,
                            ).length
                          }
                          )
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )}
              </Box>
            )}
          </Card>
        </Box>

        <Box>
          <Card
            sx={{
              bgcolor: Colors.background.light,
              border: `1px solid ${Colors.border.default}`,
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: `1px solid ${Colors.border.default}`,
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: { xs: "stretch", md: "center" },
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 900, fontSize: "1.2rem" }}>
                  {selectedCategory?.name ?? "All dishes"}
                </Typography>
                <Typography
                  sx={{ color: Colors.text.lighter, fontSize: "0.9rem" }}
                >
                  {visibleDishes.length} matching dishes
                </Typography>
              </Box>

              <TextField
                size="small"
                placeholder="Search dishes"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined sx={{ color: Colors.text.placeholder }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: { xs: "100%", md: 320 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "999px",
                    bgcolor: Colors.background.light,
                  },
                }}
              />
            </Box>

            {isLoading ? (
              <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: Colors.background.brand }} />
              </Box>
            ) : visibleDishes.length === 0 ? (
              <Box
                sx={{
                  minHeight: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 4,
                }}
              >
                <RestaurantMenu
                  sx={{ fontSize: 58, color: Colors.background.brand, mb: 1 }}
                />
                <Typography sx={{ fontWeight: 900, fontSize: "1.2rem", mb: 1 }}>
                  No dishes found
                </Typography>
                <Typography
                  sx={{ color: Colors.text.lighter, maxWidth: 420, mb: 2 }}
                >
                  Add a dish to this category so customers can start ordering
                  from your menu.
                </Typography>
                {canManageMenu ? (
                  <Button
                    variant="filled"
                    onClick={openDishDialog}
                    disabled={categories.length === 0}
                    sx={{ px: 3, fontWeight: 800 }}
                  >
                    Add dish
                  </Button>
                ) : (
                  <Typography sx={{ color: Colors.text.lighter }}>
                    You can view this menu, but only restaurant admins can add
                    dishes.
                  </Typography>
                )}
              </Box>
            ) : (
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Grid container spacing={2}>
                  {paginatedDishes.map((dish) => (
                    <Grid item xs={12} md={6} key={dish.id}>
                      <Card
                        role={canManageMenu ? "button" : undefined}
                        tabIndex={canManageMenu ? 0 : undefined}
                        onClick={() => openEditDishDialog(dish)}
                        onKeyDown={(event) => {
                          if (
                            canManageMenu &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            openEditDishDialog(dish);
                          }
                        }}
                        sx={{
                          height: "100%",
                          display: "flex",
                          gap: 2,
                          p: 1.5,
                          borderRadius: "8px",
                          border: `1px solid ${Colors.border.default}`,
                          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                          transition:
                            "box-shadow 0.18s ease, transform 0.18s ease",
                          cursor: canManageMenu ? "pointer" : "default",
                          "&:hover": {
                            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.14)",
                            transform: "translateY(-1px)",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            width: 112,
                            height: 112,
                            flexShrink: 0,
                            borderRadius: "6px",
                            overflow: "hidden",
                            bgcolor: Colors.background.default,
                            border: `1px solid ${Colors.border.default}`,
                          }}
                        >
                          <Box
                            component="img"
                            src={getDishImage(dish)}
                            alt={dish.name}
                            loading="lazy"
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </Box>

                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 900,
                                color: Colors.text.default,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                              }}
                            >
                              {dish.name}
                            </Typography>
                            <Typography sx={{ fontWeight: 900 }}>
                              {formatCurrency(dish.price)}
                            </Typography>
                          </Box>

                          <Typography
                            sx={{
                              color: Colors.text.lighter,
                              fontSize: "0.9rem",
                              mt: 0.5,
                              minHeight: 42,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {dish.description || "No description provided."}
                          </Typography>

                          <Box
                            sx={{
                              mt: 1,
                              display: "flex",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: 0.75,
                            }}
                          >
                            {canManageMenu ? (
                              <FormControlLabel
                                onClick={(event) => event.stopPropagation()}
                                control={
                                  <Switch
                                    size="small"
                                    checked={dish.isAvailable}
                                    disabled={updatingDishIds.has(dish.id)}
                                    onChange={(_, checked) =>
                                      void handleAvailabilityChange(
                                        dish,
                                        checked,
                                      )
                                    }
                                  />
                                }
                                label={
                                  dish.isAvailable ? "Available" : "Unavailable"
                                }
                                sx={{
                                  m: 0,
                                  "& .MuiFormControlLabel-label": {
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                  },
                                }}
                              />
                            ) : (
                              <Chip
                                size="small"
                                label={
                                  dish.isAvailable ? "Available" : "Unavailable"
                                }
                                color={dish.isAvailable ? "success" : "default"}
                              />
                            )}
                            {dish.isPopular && (
                              <Chip
                                size="small"
                                label="Popular"
                                icon={<StarBorder />}
                                sx={{
                                  bgcolor: "rgba(0, 204, 188, 0.12)",
                                  color: Colors.background.brand,
                                  fontWeight: 800,
                                }}
                              />
                            )}
                            {dish.isSpicy && (
                              <Chip
                                size="small"
                                label="Spicy"
                                icon={<LocalFireDepartmentOutlined />}
                              />
                            )}
                            {dish.isVegetarian && (
                              <Chip size="small" label="Vegetarian" />
                            )}
                            {canManageMenu && (
                              <EditOutlined
                                sx={{
                                  ml: "auto",
                                  color: Colors.background.brand,
                                  fontSize: 20,
                                }}
                              />
                            )}
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {dishPageCount > 1 && (
                  <Pagination
                    count={dishPageCount}
                    page={dishPage}
                    onChange={(_, nextPage) => setDishPage(nextPage)}
                    color="primary"
                    shape="rounded"
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      "& .MuiPaginationItem-root.Mui-selected": {
                        bgcolor: Colors.background.brand,
                        color: Colors.text.inverse,
                        "&:hover": {
                          bgcolor: Colors.background.brandHover,
                        },
                      },
                    }}
                  />
                )}
              </Box>
            )}
          </Card>
        </Box>
      </Box>

      <Dialog
        open={isCategoryDialogOpen}
        onClose={closeCategoryDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          component: "form",
          onSubmit: handleCreateCategory,
          sx: { borderRadius: "12px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Create category</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: Colors.text.lighter, mb: 2 }}>
            Categories are the sections customers see in your restaurant menu.
          </Typography>
          <Controller
            name="name"
            control={categoryForm.control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                autoFocus
                fullWidth
                label="Category name"
                placeholder="Example: Starters"
                error={Boolean(fieldState.error)}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            type="button"
            variant="border"
            onClick={closeCategoryDialog}
            disabled={categoryForm.formState.isSubmitting}
            sx={{ px: 2, fontWeight: 800 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            disabled={categoryForm.formState.isSubmitting}
            sx={{ px: 2, fontWeight: 800 }}
          >
            {categoryForm.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isDishDialogOpen}
        onClose={closeDishDialog}
        fullWidth
        maxWidth="md"
        fullScreen={isMobile}
        PaperProps={{
          component: "form",
          onSubmit: handleSaveDish,
          sx: { borderRadius: isMobile ? 0 : "12px" },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>
          {editingDish ? "Edit dish" : "Create dish"}
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: Colors.text.lighter, mb: 3 }}>
            {editingDish
              ? "Update what customers see, or temporarily make this dish unavailable."
              : "Keep the name short, price trusted, and image inspectable. Customers should know what they are ordering without guessing."}
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <Controller
                name="categoryId"
                control={dishForm.control}
                render={({ field, fieldState }) => (
                  <FormControl fullWidth error={Boolean(fieldState.error)}>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldState.error && (
                      <Typography
                        sx={{
                          color: Colors.background.danger,
                          fontSize: "0.75rem",
                          mt: 0.5,
                          ml: 1.75,
                        }}
                      >
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="name"
                control={dishForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Dish name"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="price"
                control={dishForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    label="Price"
                    inputProps={{ min: 0, step: "0.01" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">£</InputAdornment>
                      ),
                    }}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="image"
                control={dishForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Image URL"
                    placeholder="https://..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ImageOutlined />
                        </InputAdornment>
                      ),
                    }}
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="description"
                control={dishForm.control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    label="Description"
                    error={Boolean(fieldState.error)}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 0.5 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(4, minmax(0, 1fr))",
                  },
                  gap: 1,
                }}
              >
                <Controller
                  name="isAvailable"
                  control={dishForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(_, checked) => field.onChange(checked)}
                        />
                      }
                      label="Available"
                    />
                  )}
                />
                <Controller
                  name="isPopular"
                  control={dishForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(_, checked) => field.onChange(checked)}
                        />
                      }
                      label="Popular"
                    />
                  )}
                />
                <Controller
                  name="isVegetarian"
                  control={dishForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(_, checked) => field.onChange(checked)}
                        />
                      }
                      label="Vegetarian"
                    />
                  )}
                />
                <Controller
                  name="isSpicy"
                  control={dishForm.control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={(_, checked) => field.onChange(checked)}
                        />
                      }
                      label="Spicy"
                    />
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          {editingDish && (
            <Button
              type="button"
              variant="border"
              onClick={() => setDishPendingDeletion(editingDish)}
              disabled={dishForm.formState.isSubmitting}
              sx={{
                mr: "auto",
                px: 2,
                fontWeight: 800,
                color: Colors.background.danger,
              }}
            >
              <DeleteOutline sx={{ mr: 1 }} />
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="border"
            onClick={closeDishDialog}
            disabled={dishForm.formState.isSubmitting}
            sx={{ px: 2, fontWeight: 800 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="filled"
            disabled={dishForm.formState.isSubmitting}
            sx={{ px: 2, fontWeight: 800 }}
          >
            <FastfoodOutlined sx={{ mr: 1 }} />
            {dishForm.formState.isSubmitting
              ? editingDish
                ? "Saving..."
                : "Creating..."
              : editingDish
                ? "Save changes"
                : "Create dish"}
          </Button>
        </DialogActions>
      </Dialog>

      <PopUpDialog
        open={Boolean(dishPendingDeletion)}
        title="Delete dish?"
        description={`${dishPendingDeletion?.name ?? "This dish"} will be removed from the menu. Existing orders will keep their historical item details.`}
        confirmLabel="Delete dish"
        loadingLabel="Deleting..."
        danger
        loading={isDeletingDish}
        disableClose={isDeletingDish}
        onClose={() => setDishPendingDeletion(null)}
        onConfirm={() => void handleDeleteDish()}
      />
    </Box>
  );
};

export default RestaurantMenuPage;
