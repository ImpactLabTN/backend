'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import {
  Calendar,
  Coffee,
  Cpu,
  Filter,
  Printer,
  Users,
  Wifi,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useState, useEffect } from 'react';

// Define the Room interface
interface Room {
  id: string;
  name: string;
  description?: string;
  type: string;
  capacity: number;
  pricePerHour: number;
  amenities: string[];
  images: string[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // Filter states
  const [search, setSearch] = useState('');
  const [spaceType, setSpaceType] = useState('all');
  const [capacity, setCapacity] = useState('any');
  const [priceRange, setPriceRange] = useState([200]);
  const [amenities, setAmenities] = useState<string[]>([]);

  // Fetch rooms from the backend API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', '6');
        if (search) params.append('search', search);
        if (spaceType !== 'all') params.append('type', spaceType);
        if (capacity !== 'any') params.append('capacity', capacity);
        params.append('priceMax', priceRange[0].toString());
        if (amenities.length > 0)
          params.append('amenities', amenities.join(','));

        const response = await axios.get('/api/rooms', { params });
        console.clear();
        console.log('🚀 ~ fetchRooms ~ response:', response);

        const normalizedRooms = response.data.rooms.map((room: any) => ({
          ...room,
          id: room.id.toString(),
          description: room.description || 'No description available',
          amenities: room.amenities || [],
          images:
            room.images?.length > 0 ? room.images : ['/Assets/placeholder.jpg'],
          createdAt: new Date(room.createdAt).toISOString(),
          updatedAt: new Date(room.updatedAt).toISOString(),
          status: room.status || 'active',
        }));
        console.log('🚀 ~ normalizedRooms ~ normalizedRooms:', normalizedRooms);
        setRooms(normalizedRooms);
        setTotalPages(response.data.totalPages || 1);
        setLoading(false);
      } catch (err) {
        console.log('🚀 ~ fetchRooms ~ err:', err);
        setError('Failed to load rooms. Please try again later.');
        setLoading(false);
      }
    };
    fetchRooms();
  }, [page, search, spaceType, capacity, priceRange, amenities]);

  // Helper function to format capacity for display
  const formatCapacity = (capacity: number): string => {
    if (capacity === 1) return '1 person';
    if (capacity <= 3) return '1-3 people';
    if (capacity <= 5) return '2-4 people';
    if (capacity <= 8) return '4-8 people';
    if (capacity <= 10) return '6-10 people';
    return 'Up to 30 people';
  };

  // Map amenities to icons
  const amenityIcons: { [key: string]: React.ReactNode } = {
    WiFi: <Wifi className='h-3 w-3 mr-1' />,
    Printer: <Printer className='h-3 w-3 mr-1' />,
    Coffee: <Coffee className='h-3 w-3 mr-1' />,
    'AV Equipment': <Cpu className='h-3 w-3 mr-1' />,
    Whiteboard: <Calendar className='h-3 w-3 mr-1' />,
    Catering: <Coffee className='h-3 w-3 mr-1' />,
    Projector: <Cpu className='h-3 w-3 mr-1' />,
    'Coffee Machine': <Coffee className='h-3 w-3 mr-1' />,
  };

  // Handle filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSpaceTypeChange = (value: string) => {
    setSpaceType(value);
    setPage(1);
  };

  const handleCapacityChange = (value: string) => {
    setCapacity(value);
    setPage(1);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    setPage(1);
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setAmenities((prev) =>
      checked ? [...prev, amenity] : prev.filter((a) => a !== amenity)
    );
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex-1'>
        <section className='bg-primary py-12'>
          <div className='container mx-auto px-4'>
            <h1 className='text-3xl md:text-4xl font-bold text-white mb-4'>
              Our Spaces
            </h1>
            <p className='text-white/90 max-w-2xl'>
              Find the perfect workspace for your needs, from private offices to
              meeting rooms and event spaces.
            </p>
          </div>
        </section>

        <section className='py-12'>
          <div className='container mx-auto px-4'>
            <div className='grid md:grid-cols-4 gap-8'>
              <div className='md:col-span-1 space-y-6'>
                <div className='bg-white p-6 rounded-lg border shadow-sm'>
                  <h2 className='text-lg font-semibold mb-4 flex items-center'>
                    <Filter className='h-5 w-5 mr-2' />
                    Filters
                  </h2>

                  <div className='space-y-5'>
                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Search
                      </label>
                      <Input
                        placeholder='Search spaces...'
                        value={search}
                        onChange={handleSearchChange}
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Space Type
                      </label>
                      <Select
                        value={spaceType}
                        onValueChange={handleSpaceTypeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='all'>All Spaces</SelectItem>
                          <SelectItem value='private'>
                            Private Office
                          </SelectItem>
                          <SelectItem value='meeting'>Meeting Room</SelectItem>
                          <SelectItem value='event'>Event Space</SelectItem>
                          <SelectItem value='desk'>Hot Desk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Capacity
                      </label>
                      <Select
                        value={capacity}
                        onValueChange={handleCapacityChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Select capacity' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='any'>Any</SelectItem>
                          <SelectItem value='1-2'>1-2 people</SelectItem>
                          <SelectItem value='3-5'>3-5 people</SelectItem>
                          <SelectItem value='6-10'>6-10 people</SelectItem>
                          <SelectItem value='10+'>10+ people</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Price Range (per hour)
                      </label>
                      <div className='pt-4 px-2'>
                        <Slider
                          value={priceRange}
                          onValueChange={handlePriceChange}
                          max={200}
                          step={10}
                        />
                      </div>
                      <div className='flex justify-between mt-2 text-sm text-neutral-grey'>
                        <span>$0</span>
                        <span>${priceRange[0]}</span>
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium mb-2'>
                        Amenities
                      </label>
                      <div className='space-y-2'>
                        {[
                          'WiFi',
                          'Projector',
                          'Whiteboard',
                          'Coffee Machine',
                        ].map((amenity) => (
                          <div
                            key={amenity}
                            className='flex items-center'
                          >
                            <input
                              type='checkbox'
                              id={amenity.toLowerCase()}
                              className='mr-2'
                              checked={amenities.includes(amenity)}
                              onChange={(e) =>
                                handleAmenityChange(amenity, e.target.checked)
                              }
                            />
                            <label
                              htmlFor={amenity.toLowerCase()}
                              className='text-sm'
                            >
                              {amenity}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className='w-full'>Apply Filters</Button>
                  </div>
                </div>
              </div>

              <div className='md:col-span-3'>
                {loading ? (
                  <div className='text-center py-12'>
                    <p>Loading spaces...</p>
                  </div>
                ) : error ? (
                  <div className='text-center py-12 text-red-500'>
                    <p>{error}</p>
                  </div>
                ) : (
                  <>
                    <div className='flex justify-between items-center mb-6'>
                      <h2 className='text-xl font-semibold'>
                        {rooms.length} Spaces Available
                      </h2>
                      <Select defaultValue='recommended'>
                        <SelectTrigger className='w-[180px]'>
                          <SelectValue placeholder='Sort by' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='recommended'>
                            Recommended
                          </SelectItem>
                          <SelectItem value='price-low'>
                            Price: Low to High
                          </SelectItem>
                          <SelectItem value='price-high'>
                            Price: High to Low
                          </SelectItem>
                          <SelectItem value='capacity'>Capacity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {rooms.map((room) => (
                        <div
                          key={room.id}
                          className='bg-white rounded-lg border shadow-sm overflow-hidden'
                        >
                          <div className='relative h-48'>
                            <Image
                              src={room.images[0]}
                              alt={room.name}
                              fill
                              className='object-cover'
                            />
                            <div className='absolute top-2 right-2 bg-secondary text-neutral-black px-2 py-1 rounded text-sm font-medium'>
                              {room.type}
                            </div>
                          </div>
                          <div className='p-4'>
                            <h3 className='font-semibold text-lg mb-1'>
                              {room.name}
                            </h3>
                            <div className='flex items-center text-sm text-neutral-grey mb-3'>
                              <Users className='h-4 w-4 mr-1' />
                              <span>{formatCapacity(room.capacity)}</span>
                            </div>
                            <div className='flex flex-wrap gap-2 mb-3'>
                              {room.amenities.map((amenity) => (
                                <span
                                  key={amenity}
                                  className='bg-neutral-silver px-2 py-1 rounded-full text-xs flex items-center'
                                >
                                  {amenityIcons[amenity] || (
                                    <span className='h-3 w-3 mr-1' />
                                  )}{' '}
                                  {amenity}
                                </span>
                              ))}
                            </div>
                            <div className='flex justify-between items-center'>
                              <div className='text-primary font-semibold'>
                                {room.pricePerHour}DT / hour
                              </div>
                              <Button
                                asChild
                                size='sm'
                              >
                                <Link href={`/rooms/${room.id}/reserve`}>
                                  Book Now
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='flex justify-center mt-8'>
                      <nav className='flex items-center gap-1'>
                        <Button
                          variant='outline'
                          size='icon'
                          disabled={page === 1}
                          onClick={() => handlePageChange(page - 1)}
                        >
                          <span className='sr-only'>Previous page</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='h-4 w-4'
                          >
                            <path d='m15 18-6-6 6-6' />
                          </svg>
                        </Button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((p) => (
                          <Button
                            key={p}
                            variant='outline'
                            size='sm'
                            className={
                              p === page ? 'bg-primary text-white' : ''
                            }
                            onClick={() => handlePageChange(p)}
                          >
                            {p}
                          </Button>
                        ))}
                        <Button
                          variant='outline'
                          size='icon'
                          disabled={page === totalPages}
                          onClick={() => handlePageChange(page + 1)}
                        >
                          <span className='sr-only'>Next page</span>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='24'
                            height='24'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            className='h-4 w-4'
                          >
                            <path d='m9 18 6-6-6-6' />
                          </svg>
                        </Button>
                      </nav>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
