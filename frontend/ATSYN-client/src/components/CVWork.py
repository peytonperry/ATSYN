import webcolors
import math
from PIL import Image
import os
import tkinter as tk
from tkinter import filedialog
from colorthief import ColorThief


def select_file():
  # Create a Tkinter root window (hidden)
  root = tk.Tk()
  root.withdraw()  # Hide the main window

  # Open the file selection dialog
  file_path = filedialog.askopenfilename(
    title="Select a file",
    initialdir="/Downloads",  # Optional: Set initial directory
    filetypes=(
      ("Image files", "*.png *.jpg *.jpeg *.gif *.bmp *.ico"),
      ("PNG files", "*.png"),
      ("JPEG files", "*.jpg *.jpeg")
      # ("GIF files", "*.gif"),
      # ("All files", "*.*")
    )
  )

  if file_path:
    print(f"Selected file: {file_path}\n")
  else:
    print("No file selected.\n")
  return file_path

# Assuming 'image.jpg' is in the same directory as your script
def get_image_colors(file_path):
  color_thief = ColorThief(file_path)

  # Get the single most dominant color
  dominant_color = color_thief.get_color(quality=1)
  #print(f"Dominant color: {dominant_color}")

  # Get a palette of 5 dominant colors
  palette = color_thief.get_palette(color_count=5, quality=10)
  print(f"Color palette: {palette}\n")

  names = []
  for i in palette:
    new_name = classify_rgb_webcolors(i)
    if new_name not in names:
      names.append(new_name)
  #   names.append(new_name)
  #   for j in names:
  #     if j == new_name:
  #       names.remove(j)

    # for new_name in names:

  return names
# def add(x: int, y: int) -> int:
#   return x + y

css3_colors = webcolors.names('css3')
print(css3_colors)
print("\n")

hex_list = []
for color in css3_colors:
  code = webcolors.name_to_hex(color, spec= 'css3')
  hex_list.append(code)

rgb_list = []
for color in css3_colors:
  value = webcolors.name_to_rgb(color, spec= 'css3')
  rgb_list.append(value)

"""
Takes in an rgb value and turns it into an hex value.
If the hex value is found in the css3 dict, change the hex value to name,
else find the color that's closely related to the hex value.
"""
def classify_rgb_webcolors(rgb_tuple):
  color_hex = webcolors.rgb_to_hex(rgb_tuple)
  color_name = None

  if color_hex in hex_list:
    color_name = webcolors.hex_to_name(color_hex, spec= 'css3')
    #print(f"The color is exactly {color_name}")
    #print(f"{color_name}")
  else:
    color_name = find_closest_color(rgb_tuple)
    #print(f"The color is closest to {color_name}")
    #print(f"{color_name}")
  #return color_name
  return color_name

"""
This finds the closest color to an rgb value if the value is NOT found in the library
"""
def find_closest_color(rgb_tuple):
  min_distance = float('inf')
  closest_color = None

  for other_color in rgb_list:
    distance = euclidean(rgb_tuple, other_color)
    if distance < min_distance:
      min_distance = distance
      closest_color = webcolors.rgb_to_name(other_color)
  return closest_color

"""
This is the euclidean method, which is gonna help find the closest color to an rgb value 
by finding the shortest distance between the rgb value and a color in the
css3 dictionary
"""
def euclidean(rgb_tuple, other_color):
  r1, g1, b1 = rgb_tuple
  r2, g2, b2 = other_color
  distance = math.sqrt((r2 - r1) ** 2 + (g2 - g1) ** 2 + (b2 - b1) ** 2)
  return distance

file = select_file()
print(get_image_colors(file))
print("\n")


