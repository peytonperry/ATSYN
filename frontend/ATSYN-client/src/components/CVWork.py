import webcolors
import math
from PIL import Image
import os

image_path = "/Users/morgm/Downloads/"
image = "red-and-black-tribal.jpg"

full_image_path = os.path.join(image_path, image)
# print(f"Full path to image: {full_image_path}")

css3_colors = webcolors.names('css3')
print(css3_colors)

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
    print(f"The color is exactly {color_name}")
  else:
    color_name = find_closest_color(rgb_tuple)
    print(f"The color is closest to {color_name}")
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


r = int(input("Enter red value (0-255): "))
g = int(input("Enter green value (0-255): "))
b = int(input("Enter blue value (0-255): "))
color = (r,g,b)

cname = classify_rgb_webcolors(color) #fix exact and close part
#print(f"The color is exactly {cname}")
# except ValueError:
#   cname = classify_rgb_webcolors(color11)
  #print(f"The color is most like {cname}")